import ArrayReader from '../utils/array_reader';
import C from './consts';

export default (data) => {
    const secData = {};
    const reader = new ArrayReader(data);
    let length = C.HEADER_SIZE;

    secData.headerBuff  = reader.read(length);

    length = reader.readInt();
    secData.colorModeBuff = reader.read(length);

    length = reader.readInt();
    secData.imageResourcesBuff = reader.read(length);

    length = reader.readInt();
    secData.layerAndMaskBuff = reader.read(length);

    secData.imageDataBuff = reader.read(data.length - reader.tell());

    return secData;
};
