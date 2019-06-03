import {KEY, TYPE} from '../key-map';
import {getValue} from '../typed-values';
import {rgbColorDecoder} from '../color';

export default (rawStyle) => {
    const style = {};
    const styleData = rawStyle.value;
    // console.log('parse stroke', rawStyle);
    if (rawStyle.type !== TYPE.OBJECT) {
        console.error('Type error: The Stroke style must be an object');
    }

    style.enabled = getValue(styleData[KEY.ENABLED]);
    style.opacity = getValue(styleData[KEY.OPACITY]);
    style.size = getValue(styleData[KEY.SIZE]);
    style.color = rgbColorDecoder(styleData[KEY.COLOR]);
    style.blendMode = getValue(styleData[KEY.MODE]);
    style.style = getValue(styleData[KEY.STYLE]);
    style.paint = getValue(styleData[KEY.PAINT]);
    
    return style;
}