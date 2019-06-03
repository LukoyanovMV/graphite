class Descriptor {
    constructor(reader) {
        this.reader = reader;
        this.data = {};
    }

    parseVOFStr() {
        let len = this.reader.readInt();
        return len !== 0 ? this.reader.readStr(len) : this.reader.readStr(4);
    }

    parse() {
        this.data.classRef = this.parseClass();
        const itemsNumber = this.reader.readInt();

        for (let i = 0; i < itemsNumber; i++) {
            this.parseItem();
        }
        return this.data;
    }

    parseItem(setAsProp = true) {
        let key = setAsProp ? this.parseVOFStr() : '';
        key = key.trim();
        const type = this.reader.readStr(4);
        let val;
        let blockLen;
        let itemsNum;

        switch (type) {
        case 'UntF':
            val = this._UntF();
            break;
        case 'bool':
            val = !!this.reader.readByte();
            break;
        case 'Objc':
            val = new Descriptor(this.reader).parse();
            break;
        case 'enum':
            val = this._enum();
            break;
        case 'doub':
            val = this.reader.readDoub();
            break;
        case 'VlLs':
            itemsNum = this.reader.readInt();
            val = this._VlLs(itemsNum);
            val['itemsNum'] = itemsNum;
            break;
        case 'TEXT':
            val = this.reader.readUniStr();
            break;
        case 'long':
            val = this.reader.readInt();
            break;
        case 'tdta':
            blockLen = this.reader.readInt();
            val = this.reader.readStr(blockLen);
            break;
        case 'ObAr':
        val = this._ObAr();
            break;
        default:
            console.log('Unimplemented data type in descriptor', key, '->', type);
            val = false;
        }
        if (setAsProp) {
            this.data[key] = {
                type: type,
                value: val
            };    
        }
        return {
            type: type,
            value: val
        }; 
    }

    _enum() {
        return {
            units: this.parseVOFStr(),
            value: this.parseVOFStr()
        };
    }

    _VlLs(itemsNum) {
        const values = [];
        
        for (let i = 0; i < itemsNum; i++) {
            values.push(this.parseItem(false))
        }
        return values;
    }

    _UntF() {
        return {
            units: this.reader.readStr(4),
            value: this.reader.readDoub()
        };
    }

    _ObAr() {
        const res = {};

        // console.log(this.reader.tell(), this.reader);
        // console.log(this.reader.readInt())
        // console.log(this.reader.readInt())
        // console.log(this.reader.readWord())
        // console.log(this.reader.readInt())
        // console.log(this.reader.readStr(13))
        // itemsNum = this.reader.readInt();
        // val = this._VlLs(itemsNum);
        // console.log(val);
        
        res.val = this.reader.read(327);
        return res;
    }

    parseClass() {
        return {
            name: this.reader.readUniStr(),
            id: this.parseVOFStr()
        };
    }
};

export default Descriptor;
