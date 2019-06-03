import {TYPE, getEnumVal} from './key-map';

export const getValue = (typedValue) => {
    let val;
    switch (typedValue.type) {
        case TYPE.UNIT_FLOAT:
        case TYPE.BOOL: {
            val = typedValue.value;
            break;
        }
        case TYPE.ENUM: {
            val = getEnumVal(typedValue.value);
            break;
        }
        default: {
            val = typedValue;
        }
    }
    return val;
}