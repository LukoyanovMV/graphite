import strokeDecoder from './style/stroke-style';
import colorOverDecoder from './style/color_over_style';
import innerShadowDecoder from './style/inner_shadow_style';
import dropShadowDecoder from './style/drop_shadow_style';
import KEY from './key-map';

const stylesDecoder = (data) => {
    const result = {};

    if (data[KEY.STROKE]) {
        result['STROKE'] = strokeDecoder(data[KEY.STROKE]);
    }
    if (data[KEY.COLOR_OVER]) {
        result['COLOR_OVER'] = colorOverDecoder(data[KEY.COLOR_OVER]);
    }
    if (data[KEY.INNER_SHADOW]) {
        result['INNER_SHADOW'] = innerShadowDecoder(data[KEY.INNER_SHADOW]);
    }
    if (data[KEY.DROP_SHADOW]) {
        result['DROP_SHADOW'] = dropShadowDecoder(data[KEY.DROP_SHADOW]);
    }
    return result;
}

export const decode = (key, data) => {
    let result;
    if (key === KEY.STYLES) {
        result = stylesDecoder(data);
    }

    return result;
}

export default decode;