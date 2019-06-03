import ArrayReader from '../utils/array_reader';
import {pad4} from '../utils/bytes_lib';
import {decodeRLE} from './rle';
import C from './consts';

import * as adParser from './additional';

class LayersMaskParser {
    constructor(data) {
        this.data = data;
        this.layersCount = 0;
        this.layers = [];
    }

    parse(data) {
        if (data) {
            this.data = data;
            this.layersCount = 0;
            this.layers = [];
        }

        if (this.data) {
            const reader = new ArrayReader(this.data);

            const layerInfoLength = reader.readInt();
            const layerInfo = reader.read(layerInfoLength);

            const endPos = this.parseLayerInfo(layerInfo);
            this.parseChannelsImageData(layerInfo, endPos);

            // console.log(layerInfoLength, endPos);

            // const globalLayerMaskInfoLength = reader.readInt();
            // const globalLayerMaskInfo = reader.read(layerInfoLength);
        }

        return this.layers;
    }

    readPosition(layerInfo, reader) {
        layerInfo.top = reader.readInt();
        layerInfo.left = reader.readInt();
        layerInfo.bottom = reader.readInt();
        layerInfo.right = reader.readInt();
    }

    readChannelsInfo(layerInfo, reader) {
        layerInfo.channelsInfo = [];

        for (let ch = 0; ch < layerInfo.channelsNumber; ch++) {
            layerInfo.channelsInfo[ch] = {};

            layerInfo.channelsInfo[ch].channelId = reader.readWord();
            if (layerInfo.channelsInfo[ch].channelId > 255) {
                layerInfo.channelsInfo[ch].channelId = ~(layerInfo.channelsInfo[ch].channelId ^ 0xffff);
            }

            layerInfo.channelsInfo[ch].channelDataLength = reader.readInt();
        }
    }

    parseLayerInfo(infoData) {
        const reader = new ArrayReader(infoData);
        let layerInfo;
        let extraDataLength;
        let layerMaskDataLength;
        let blendingRangesDataLength;
        let layerNameLength;
        let endPos;
        let notParsed = 0;

        this.layersCount = reader.readWord();

        const  notParsedKeys = [];

        for (let i = 0; i < this.layersCount; i++) {
            layerInfo = {};

            // basic layer data
            this.readPosition(layerInfo, reader);
            layerInfo.channelsNumber = reader.readWord();
            this.readChannelsInfo(layerInfo, reader);
            layerInfo.signature = reader.readStr(4);
            layerInfo.blendMode = reader.readStr(4);
            layerInfo.opacity = reader.readByte();
            layerInfo.clipping = reader.readByte();
            layerInfo.flags = reader.readByte();
            layerInfo.filler = reader.readByte();

            // extra layer data
            extraDataLength = reader.readInt();
            let pos = reader.tell();

            layerMaskDataLength = reader.readInt();
            layerInfo.layerMaskData = reader.read(layerMaskDataLength);

            blendingRangesDataLength = reader.readInt();
            layerInfo.blendingRangesData = reader.read(blendingRangesDataLength);

            layerNameLength = reader.readByte();
            layerInfo.name = reader.readStr(pad4(layerNameLength));

            let sign = reader.readStr(4);
            let key;
            let additionalInformationLength;
            let additionalInformation;

            while (sign === '8BIM' && reader.tell() < pos + extraDataLength) {
                key = reader.readStr(4);
                additionalInformationLength = reader.readInt();
                additionalInformation = reader.read(additionalInformationLength);
                if (key in adParser) {
                    layerInfo[adParser.key2Attr(key)] = adParser[key](additionalInformation, additionalInformationLength);
                } else {
                    if (!~notParsedKeys.indexOf(key)) {
                        notParsedKeys.push(key);
                    }
                }
                sign = reader.readStr(4);
            }

            endPos = pos + extraDataLength;
            reader.seek(endPos);
            this.layers.push(layerInfo);
        }
        console.log('not parsed -> ', notParsedKeys.length, notParsedKeys);
        return endPos;
    }

    parseChannelsImageData(infoData, startPos) {
        let byteCounts;
        let byteCountsLength;
        let layer;
        let compression;
        let chDataLength;
        let rawChData;
        let channelInfo;

        const reader = new ArrayReader(infoData);
        reader.seek(startPos);

        for (let j = 0; j < this.layers.length; j++) {

            layer = this.layers[j];

            for (let i = 0; i < layer.channelsNumber; i++) {

                channelInfo = layer.channelsInfo[i];
                compression = reader.readWord();

                if ((layer.bottom - layer.top) > 0 && channelInfo.channelDataLength > 2) {
                    if (compression === C.COMPRESSION_RAW) {
                        byteCounts = (layer.bottom - layer.top) * (layer.right - layer.left);
                        rawChData = reader.read(byteCounts);
                        layer.channelsInfo[i].rawChData = rawChData;
                    } else if (compression === C.COMPRESSION_RLE) {
                        byteCounts = reader.readAsWords(layer.bottom - layer.top);
                        chDataLength = byteCounts.reduce((p, c) => { return p + c; }, 0);
                        rawChData = decodeRLE(reader.read(chDataLength), layer.right - layer.left, layer.bottom - layer.top, byteCounts);
                        layer.channelsInfo[i].rawChData = rawChData;
                    }
                }
            }
        }
    }
};

export default LayersMaskParser;
