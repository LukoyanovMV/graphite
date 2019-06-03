import Rectangle from './rectangle';

export const createCanvas = (w, h) => {
    const canvas = document.createElement('CANVAS');
    canvas.width = w;
    canvas.height = h;
    return canvas;
};

export const clamp = (v, vmin, vmax) => {
    if (v < vmin) {
        return vmin;
    } else if (v >= vmax) {
        return vmax;
    } else {
        return v;
    }
}

export const Rect = (width = 0, height = 0, left = 0, top = 0) => {
    return new Rectangle(width, height, left, top)
}
