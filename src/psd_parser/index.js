import splitSections from './split_sections';
import parseHeader from './parse_header';
import ImageDataParser from './image_data_parser';
import LayersMaskParser from './layers_mask_parser';

class PsdParser {
    constructor(data) {
        if (data) {
            this.rawData = data;
        }

        this.imageDataParser = new ImageDataParser(); 
    }

    parse(data) {
        let res = {};

        if (data) {
            this.rawData = data;
        }

        if (!this.rawData) {
            throw new Error('ParserError: data is undefined');
        }

        this.sectionsData = splitSections(this.rawData);

        let header = parseHeader(this.sectionsData.headerBuff);

        let imageData = this.imageDataParser.setData(
            this.sectionsData.imageDataBuff,
            {
                width: header.width,
                height: header.height,
                channelsNumber: header.channelsNumber
            })
            .parse();

        let layersMaskParser = new LayersMaskParser(this.sectionsData.layerAndMaskBuff);
        let layersData = layersMaskParser.parse();

        res = {
            header: header,
            imageData: imageData,
            layersData: layersData
        };

        return res;
    }
}

export default PsdParser;
