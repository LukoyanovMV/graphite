import {KEY, TYPE} from '../key-map';
import {getValue} from '../typed-values';
import {rgbColorDecoder} from '../color';

export default (rawStyle) => {
    const style = {};
    const styleData = rawStyle.value;

    if (rawStyle.type !== TYPE.OBJECT) {
        console.error('Type error: The Layer style must be an object');
    }

    style.enabled = getValue(styleData[KEY.ENABLED]);
    style.opacity = getValue(styleData[KEY.OPACITY]);
    style.color = rgbColorDecoder(styleData[KEY.COLOR]);
    style.blendMode = getValue(styleData[KEY.MODE]);
    style.distance = getValue(styleData[KEY.DISTANCE]);
    style.size = getValue(styleData[KEY.BLUR]);
    style.choke = getValue(styleData[KEY.CHOKE]);
    style.angle = getValue(styleData[KEY.ANGLE]);
    style.useGlobalAngle = getValue(styleData[KEY.USE_GLOBAL_LIGHT]);
    
    return style;
}