export const KEY = {
    STYLES: 'lfx2',
    STROKE: 'FrFX',
    COLOR_OVER: 'SoFi',
    INNER_SHADOW: 'IrSh',
    DROP_SHADOW: 'DrSh',

    ENABLED: 'enab',
    OPACITY: 'Opct',
    SIZE: 'Sz',
    COLOR: 'Clr',
    MODE: 'Md',
    STYLE: 'Styl',
    PAINT: 'PntT',
    DISTANCE: 'Dstn',
    BLUR: 'blur',
    CHOKE: 'Ckmt',
    ANGLE: 'lagl',
    NOISE: 'Nose',
    ANTI_ALIASED: 'AntA',
    USE_GLOBAL_LIGHT: 'uglg'
}

export const TYPE = {
    OBJECT: 'Objc',
    BOOL: 'bool',
    UNIT_FLOAT: 'UntF',
    ENUM: 'enum'
}

export const FLOAT_UNITS = {
    ANGLE: '#Ang',
    DENSITY: '#Rsl',
    DISTANCE: '#Rlt',
    NONE: '#Nne',
    PERCENT: '#Prc',
    PIXELS: '#Pxl',
    POINTS: '#Pnt',
    MILLIMETERS: '#Mlm'
}

export const BLEND_MODE = {
    'pass': 'source-over',
    'Nrml': 'source-over',
    'diss': '',
    'dark': 'darken',
    'Mltp': 'multiply',
    'idiv': 'color-burn',
    'lbrn': '',
    'dkCl': '',
    'lite': 'lighten',
    'scrn': '',
    'div ': 'color-dodge',
    'lddg': '',
    'lgCl': '',
    'over': '',
    'sLit': 'soft-light',
    'hLit': 'hard-light',
    'vLit': '',
    'lLit': '',
    'pLit': '',
    'hMix': '',
    'diff': 'difference',
    'smud': '',
    'fsub': '',
    'fdiv': '',
    'hue ': 'hue',
    'sat ': 'saturation',
    'colr': 'color',
    'lum ': 'luminosity',
    'Strt': 'saturation'  
};

const FILL_STYLE = {
    InsF: 'inset',
    OutF: 'outset',
    CtrF: 'center'
};

const PAINT_STYLE = {
    SClr: 'color'
};

const enums = {
    BlnM: BLEND_MODE,
    FStl: FILL_STYLE,
    FrFl: PAINT_STYLE
};

export const getEnumVal = (valObj) => {
    let val;
    const enumList = enums[valObj.units];
    if (enumList) {
        val = enumList[valObj.value];
    } else {
        console.log(valObj);
    }
    return val;
}

export default KEY;