
import {readWord, readInt, readStr} from '../../../utils/bytes_lib';
import ArrayReader from '../../../utils/array_reader';

const VERSION_POS = 0;
const COUNT_POS = 2;
const SIGN = '8BIM';

const cmnS = (reader) => {
    const res = {};
    res.length = reader.readInt();
    res.version = reader.readInt();
    res.visible = !!reader.readByte();
    res.unused = reader.readWord();
    return res;
};

const shadows = (reader) => {
    const res = {};
    res.length = reader.readInt();
    res.version = reader.readInt();
    res.blur = reader.readInt();
    res.intensity = reader.readInt();
    res.angle = reader.readInt();
    res.distance = reader.readInt();
    res.color = reader.read(10);
    res.blendMode = reader.read(8);
    res.enabled = !!reader.readByte();
    res.angleUsing = !!reader.readByte();
    res.opacity = reader.readByte();
    res.nativeColor = reader.read(10);
    return res;
};

const oglw = (reader) => {
    const res = {};
    res.length = reader.readInt();
    res.version = reader.readInt();
    res.blur = reader.readInt();
    res.intensity = reader.readInt();
    res.color = reader.read(10);
    res.blendMode = reader.read(8);
    res.enabled = !!reader.readByte();
    res.opacity = reader.readByte();
    if (res.version === 2) {
        res.nativeColor = reader.read(10);
    }
    return res;
};

const iglw = (reader) => {
    const res = {};
    res.length = reader.readInt();
    res.version = reader.readInt();
    res.blur = reader.readInt();
    res.intensity = reader.readInt();
    res.color = reader.read(10);
    res.blendMode = reader.read(8);
    res.enabled = !!reader.readByte();
    res.opacity = reader.readByte();
    if (res.version === 2) {
        res.invert = !!reader.readByte();
        res.nativeColor = reader.read(10);
    }
    return res;
};

const bevl = (reader) => {
    const res = {};

    res.length = reader.readInt();
    res.version = reader.readInt();
    res.angle = reader.readInt();
    res.strength = reader.readInt();
    res.blur = reader.readInt();
    res.highlightBlendMode = reader.read(8);
    res.shadowBlendMode = reader.read(8);
    res.highlightColor = reader.read(10);
    res.shadowColor = reader.read(10);
    res.bevelStyle = reader.readByte();
    res.highlightOpacity = reader.readByte();
    res.shadowOpacity = reader.readByte();
    res.enabled = !!reader.readByte();
    res.angleUsing = !!reader.readByte();
    res.upOrDowd = !!reader.readByte();
    if (res.version === 2) {

        res.realHighlightColor = reader.read(10);
        res.realShadowColor = reader.read(10);
    }
    return res;
};

const sofi = (reader) => {
    const res = {};
    res.length = reader.readInt();
    res.version = reader.readInt();
    res.blandMode = reader.readStr(4);
    res.colorSpace = reader.read(10);
    res.opacity = reader.readByte();
    res.enabled = !!reader.readByte();
    res.nativeColor = reader.read(10);
    return res;
};

export default (data) => {
    const version = readWord(data, VERSION_POS);
    const effectsCount = readWord(data, COUNT_POS);
    const reader = new ArrayReader(data);
    const res = {};
    reader.seek(4);

    let sign;
    let fxKey;
    let fxData;
    for (let i = 0; i < 7; i++) {
        sign = reader.readStr(4);
        if (sign === SIGN) {
            fxKey = reader.readStr(4);

            if (fxKey === 'cmnS') {
                res[fxKey] = cmnS(reader);
            }
            if (fxKey === 'dsdw' || fxKey === 'isdw') {
                res[fxKey] = shadows(reader);
            }
            if (fxKey === 'oglw') {
                res[fxKey] = oglw(reader);
            }
            if (fxKey === 'iglw') {
                res[fxKey] = iglw(reader);
            }
            if (fxKey === 'bevl') {
                res[fxKey] = bevl(reader);
            }
            if (fxKey === 'sofi') {
                res[fxKey] = sofi(reader);
            }
        } else {
            console.error('SIGN error');
        }
    }
    return res;
};
