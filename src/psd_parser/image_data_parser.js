import C from './consts';
import ArrayReader from '../utils/array_reader';
import {decodeRLE} from './rle';

class ImageDadaParse {
    constructor() {
        this.clear();
    }

    clear() {
        this.compression = -1;
        this.channelsData = [];
        this.byteCounts = [];
        this.data = [];
    }

    setData(data, config) {
        if (data && config) {
            this.clear();
            this.data = data;
            this.config = config;
            this.reader = new ArrayReader(this.data);
        }

        return this;
    }

    prepareDataForParse() {
        this.compression = this.reader.readWord();
        if (this.compression === C.COMPRESSION_RLE) {
            this.parseByteCounts();
        }
    }

    parseByteCounts() {
        this.reader.seek(2);
        let buff;
        for (let i = 0; i < this.config.channelsNumber; i++) {
            this.byteCounts[i] = this.reader.readAsWords(this.config.height);
        }
    }

    splitChannelsData() {
        const chDataOffset = 2 + this.config.channelsNumber * this.config.height * 2;
        let chDataLength;

        this.reader.seek(chDataOffset);

        for (let i = 0; i < this.config.channelsNumber; i++) {
            chDataLength = this.byteCounts[i].reduce((p, c) => { return p + c; }, 0);
            this.channelsData[i] = {
                data: this.reader.read(chDataLength),
                dataLength: chDataLength,
                index: i
            };
        }
    }

    parse() {
        this.prepareDataForParse();
        this.splitChannelsData();
        let res = [];

        for (let i in this.channelsData) {
            res[i] = decodeRLE(this.channelsData[i].data, this.config.width, this.config.height, this.byteCounts[i]);
        }
        return res;
    }
}

export default ImageDadaParse;
