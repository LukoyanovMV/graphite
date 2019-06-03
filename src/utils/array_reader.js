import {readStr, readDoub, readInt, readBigInt, readWord} from './bytes_lib';
import iconv from 'iconv-lite';

class ArrayReader {
    constructor(array) {
        if (!array) {
            throw new Error('ArrayReader: initialization error');
        }

        this.pos = 0;
        this.array = array;
    }

    tell() {
        return this.pos;
    }

    seek(pos) {
        if (pos < 0 || pos === undefined) {
            this.pos = 0;
        } else if (pos > this.array.length - 1) {
            this.pos = this.array.length - 1;
        } else {
            this.pos = pos;
        }
    }

    read(len) {
        let res;
        let end = this.pos + len;

        if (this.isEnd()) {
            return false;
        }

        if (this.end >= this.array.length) {
            end = undefined;
        }

        res = this.array.slice(this.pos, end);
        this.pos = end === undefined ? this.array.length : end;

        return res;
    }

    readAsWords(len) {
        let buff = this.read(len * 2);
        let res = [];
        for (let i = 0; i < len * 2; i += 2) {
            res.push(readWord(buff, i));
        }

        return res;
    }

    readInt() {
        let val;

        if (!this.isEnd() && this.pos + 4 <= this.array.length) {
            val = readInt(this.array, this.pos);
            this.pos += 4;
        }

        return val;
    }

    readBigInt() {
        let val;

        if (!this.isEnd() && this.pos + 8 <= this.array.length) {
            val = readBigInt(this.array, this.pos);
            this.pos += 8;
        }

        return val;        
    }

    readDoub() {
        let val = this.read(8);
        const dataView = new DataView(val.buffer);
        val = dataView.getFloat64(0);
        return val;
    }

    readWord() {
        let val;

        if (!this.isEnd() && this.pos + 2 <= this.array.length) {
            val = readWord(this.array, this.pos);
            this.pos += 2;
        } else {
            console.error('out of range');
        }

        return val;
    }

    readByte() {
        let val;

        if (!this.isEnd()) {
            val = this.array[this.pos];
            this.pos += 1;
        } else {
            console.error('out of range');
        }

        return val;
    }

    readStr(len) {
        let val;

        if (!this.isEnd() && this.pos + len <= this.array.length) {
            val = readStr(this.array, this.pos, len);
            this.pos += len;
        } else {
            console.error('out of range');
        }

        return val;
    }

    isEnd() {
        return this.pos >= this.array.length;
    }

    readUniStr(length) {
        if (!length) {
            length = this.readInt();
        }
        return iconv.decode(new Buffer(this.read(length * 2)), 'utf-16be').replace(/\u0000/g, '');
    }
}

export default ArrayReader;
