import iconv from 'iconv-lite';

export const pad4 = (val) => {
    return ((val + 4) & ~0x03) - 1;
};

export const readInt = (arr, from) => {
    let val = 0;
    for (var i = 0; i < 4; ++i) {
        val += arr[i + from];
        if (i < 3) {
            val = val << 8;
        }
    }
    return val;
};

export const readBigInt = (arr, from) => {
    let val = 0;
    for (var i = 0; i < 8; ++i) {
        val += arr[i + from];
        if (i < 7) {
            val = val << 8;
        }
    }
    return val;
};

export const readDoub = (arr, from) => {
    let val = 0;
    for (var i = 0; i < 8; ++i) {
        val += arr[i + from];
        if (i < 7) {
            val = val << 8;
        }
    }
    return val;
};

export const readWord = (arr, from) => {
    let val = 0;
    for (var i = 0; i < 2; ++i) {
        val += arr[i + from];
        if (i < 1) {
            val = val << 8;
        }
    }
    return val;
};

export const readStr = (arr, from, length) => {
    let buff = [];
    for (var i = 0; i < length; ++i) {
        buff.push(arr[i + from]);
    }
    return String.fromCharCode.apply(null, buff);
};

export const toBits = (val, limit) => {
    let res;
    if (!limit) {
        limit = 32;
    }
    res = val.toString(2).split('').map(val=>parseInt(val));
    return res;
};

export const readUniStr = (arr, from, length) => {
    if (!length) {
        length = readInt(arr, 0);
    }

    return iconv.decode(new Buffer(arr.slice(4, 4 + length * 2)), 'utf-16be').replace(/\u0000/g, '');
};
