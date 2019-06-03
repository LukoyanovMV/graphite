export const rgbColorDecoder = (colorObj) => {
    const r = Math.round(colorObj.value.Rd.value);
    const g = Math.round(colorObj.value.Grn.value);
    const b = Math.round(colorObj.value.Bl.value);
    return {
        r: r,
        g: g,
        b: b
    };
};