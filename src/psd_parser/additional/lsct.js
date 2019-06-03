import {readInt, readStr} from '../../utils/bytes_lib';

export default (data) => {
    const res = {};
    res.type =  readInt(data, 0);
    if (data.length >= 12) {
        res.sign = readStr(data, 4, 4);
        res.key = readStr(data, 8, 4);
    }

    if (data.length >= 16) {
        res.subType = readStr(data, 12, 4);
    }

    return res;
};
