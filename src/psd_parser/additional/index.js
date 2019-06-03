import {readInt, readWord, readStr, readUniStr} from '../../utils/bytes_lib';
import Descriptor from '../descriptor';
import ArrayReader from '../../utils/array_reader';

import _lsct from './lsct';
import _lrFX from './lrFX';

const readDescriptor = (data, offset = 0) => {
    const reader = data instanceof ArrayReader ? data : new ArrayReader(data);
    let res = {};
    let version;
    
    reader.seek(reader.tell() + offset);
    
    version = reader.readInt();
    if (version === 16) {
        res = new Descriptor(reader).parse();
    } else {
        console.log('descriptor version error', version);
    }
    return res;
};

const _lyid = (data) => {
    return readInt(data, 0);
};

const _luni = (data, len) => {
    return readUniStr(data, 0);
};

const _lnsr = (data) => {
    return readInt(data, 0);
};

const _clbl = (data) => {
    return !!data[0];
};

const _infx = (data) => {
    return !!data[0];
};

const _knko = (data) => {
    return !!data[0];
};

const _lspf = (data) => {
    return readInt(data, 0);
};

const _lclr = (data) => {
    return data;
};

const _fxrp = (data) => {
    return data;
};

const _shmd = (data) => {
    // console.warn('shmd - not implemented');
    return 'some data';
};

const _lfx2 = (data, len) => {
    let res = {};
    let descriptorOffset = 4;
    if (readInt(data, 0) === 0) {
        res = readDescriptor(data, descriptorOffset);
    } else {
        console.log('lfx2 error');
    }
    return res;
};

const _lfxs = (data, len) => {
    return _lfx2(data, len);
}

const _SoCo = (data, len) => {
    return readDescriptor(data);
};

const _lyvr = (data, len) => {
    return readInt(data, 0);
}

const _vogk = (data, len) => {
    let res = {};
    let descriptorOffset = 4;
    if (readInt(data, 0) === 1) {
        res = readDescriptor(data, descriptorOffset);
    } else {
        console.log('vogk error');
    }
    return res;    
}

const _TySh = (data, len) => {
    let res = {};
    const reader = new ArrayReader(data);
    const version = reader.readWord();
    if (version === 1) {
        res.version = version;
        res.transform = reader.read(48);
        res.textVersion = reader.readWord();
        res.textData = readDescriptor(reader);
        res.warpVersion = reader.readWord();
        res.warpData = readDescriptor(reader);
        res.left = reader.readBigInt();
        res.top = reader.readBigInt();
        res.right = reader.readBigInt();
        res.bottom = reader.readBigInt();
    } else {
        console.log('TySh error');
    }
    return res;
};

const _SoLd = (data, len) => {
    let res = {};
    const reader = new ArrayReader(data);

    const identifier = reader.readStr(4);
    const version = reader.readInt();
    if (version === 4 && identifier === 'soLD') {
        res = readDescriptor(reader);
        // console.log(res);
    } else {
        console.log('SoLd error');
    }
};

const _key2Attr = (key) => {
    const _map = {
        lyid: 'id',
        luni: 'uniName',
        lnsr: 'nameSource',
        clbl: 'blendClippingElements',
        infx: 'blendInteriorElements',
        knko: 'knockout'
    };
    return key in _map ? _map[key] : key;
};

export {
    _luni as luni,
    _lyid as lyid,
    _lnsr as lnsr,
    _clbl as clbl,
    _infx as infx,
    _knko as knko,
    _lspf as lspf,
    _lclr as lclr,
    _fxrp as fxrp,
    _shmd as shmd,
    _lsct as lsct,
    _lrFX as lrFX,
    _lfx2 as lfx2,
    _SoCo as SoCo,
    _lyvr as lyvr,
    _lfxs as lfxs,
    _vogk as vogk,
    _TySh as TySh,
    _SoLd as SoLd,
    _key2Attr as key2Attr
};
