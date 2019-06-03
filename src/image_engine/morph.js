import { clamp } from '../utils/';
import { Map2D } from './common';

export const ChamferDistance = (data, w, h, inverseInit = false) => {
    const distMap = Map2D(w, h);
    const out = Map2D(w, h);

    const d1 = 253; // 252.6 = 256 * 0.9866
    const d2 = 362; // 362.0 = 256 * 1.4142
    const d3 = 566; // 565.8 = 256 * 2.2062

    const fk = [
        [-1, -2], 
        [1, -2], 
        [-2, -1], 
        [-1, -1], 
        [0, -1], 
        [1, -1], 
        [2, -1],
        [-1,  0], 
        [0,  0]
    ];

    const fv = [
        d3,     d3,
    d3, d2, d1, d2, d3,
        d1,  0
    ];

    const bk = [
        [0,  0],
        [1,  0],
        [-2, 1],
        [-1, 1],
        [0,  1],
        [1,  1],
        [2,  1],
        [-1, 2],
        [1,  2]
    ];
        
    const bv = [
            0, d1,
    d3, d2, d1, d2, d3,
        d3,     d3
    ];

    const inf = (w + h) * d3;
    const n = 9;

    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            if (!inverseInit) {
                distMap.setV(x, y, !data.getV(x,y) ? inf : 255 - data.getV(x,y));
            } else {
                distMap.setV(x, y, data.getV(x,y) == 255 ? inf : data.getV(x,y));
            }
        }
    }

    for (let y = 0; y < h; ++y) {
        for (let x = 0; x < w; ++x) {
            for (let i = n-1; i >= 0; --i) {
                let cx = clamp (x + fk[i][0], 0, w-1);
                let cy = clamp (y + fk[i][1], 0, h-1);
                let v = distMap.getV(cx, cy) + fv[i];
                if (v < distMap.getV(x, y)) {
                    distMap.setV(x, y, v);
                }
            }
        }
    }

    for (let y = h-1; y >= 0; --y) {
        for (let x = w-1; x >= 0; --x) {
            for (let i = n-1; i >= 1; --i) {
                let cx = clamp (x + bk[i][0], 0, w-1);
                let cy = clamp (y + bk[i][1], 0, h-1);
                let v = distMap.getV(cx, cy) + bv[i];
                if (v < distMap.getV(x, y)) {
                    distMap.setV(x, y, v);
                }
            }
            out.setV(x, y, distMap.getV(x, y));
        }
    }

    return out;
};



export const BoxBlurAndDilateSettings = (sizeInPixels, spread) => {
    const bd = {};

    bd.enlargePixels = sizeInPixels + 2;
    bd.dilatePixels = spread ? Math.floor(sizeInPixels * spread/100 + 0.5) : 0;
    
    const blurPixels = Math.abs(sizeInPixels - bd.dilatePixels);
    const fudge = 1.85 - 0.45 * Math.min (1.0, blurPixels / 10.0);

    bd.boxBlurRadius = Math.max(blurPixels - fudge, 0);

    bd.getEnlargePixels = () => bd.enlargePixels;
    bd.getDilatePixels = () => bd.dilatePixels;
    bd.getBoxBlurRadius = () => bd.boxBlurRadius;

    return bd;
};



export const GrayscaleErosion = (mask, width, height, size) => {
    let dist;
    if (size > 0) {
        dist = ChamferDistance(mask, width, height, true);
        let multSize = size * 256;
        let multSizePlusOne = multSize + 256
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let distance = dist.getV(x, y);
                if (distance <= multSize) {
                    dist.setV(x, y, 255 * 256);
                } else if (distance < multSizePlusOne) {
                    dist.setV(x, y, (255 - (distance - multSize)) * 256);
                } else {
                    dist.setV(x, y, 0);
                }
            }
        }
    } else {
        dist = Map2D(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                dist.setV(x, y, (255- mask.getV(x, y)) * 256);
            }
        }
    }
    return dist;
}



export const GrayscaleDilation = (mask, width, height, size) => {
    let dist;

    dist = ChamferDistance(mask, width, height);
    let multSize = size * 256;
    let multSizePlusOne = multSize + 256
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let distance = dist.getV(x, y);
            if (distance <= multSize) {
                dist.setV(x, y, 255 * 256);
            } else if (distance < multSizePlusOne) {
                dist.setV(x, y, (255 - (distance - multSize)) * 256);
            } else {
                dist.setV(x, y, 0);
            }
        }
    }

    return dist;
}



export const boxBlur = (dist, width, height, radius) => {
    
    const pass = function(inn, out, w, h, radius) {
        const widthMinus1 = w - 1;
        const r = Math.floor(radius);
        const frac = radius - r;  
        const a = Math.floor(frac * 256);
        const aDiv = (2*r+1)*256 + a*2;

        for (let y = 0; y < h; y++) {
            let ta = 0;

            for (let i = -r; i <= r; i++ ) {
                const v = inn.getV(clamp(i, 0, w-1), y);
                ta += v * 256;
            }

            ta += a * inn.getV(clamp (-r-1, 0, w-1), y);
            ta += a * inn.getV(clamp (r+1, 0, w-1), y);

            for (let x = 0; x < w; x++ ) {
                
                out.setV(y, x, (ta * 1 + 0) / aDiv);
                
                let r1 = x + r + 1;
                let r2 = r1 + 1;
                if (r2 > widthMinus1) {				
                    r2 = widthMinus1;
                    if (r1 > widthMinus1) {
                        r1 = widthMinus1;
                    }
                }
      
                let l1 = x - r - 1;
                let l2 = l1 + 1;
                if (l1 < 0) {
                    l1 = 0;
                    if (l2 < 0) {
                        l2 = 0;
                    }
                }

                let vold = (inn.getV(l2, y) << 8) + a * (inn.getV(l1, y) - inn.getV(l2, y));
                let vnew = (inn.getV(r1, y) << 8) + a * (inn.getV(r2, y) - inn.getV(r1, y));
      
                ta += vnew;
                ta -= vold;
            }
        }
    }

    let halfRadius = radius / 2;
    let temp = Map2D(height, width);
    let result = Map2D(width, height);

    pass(dist, temp, width, height, halfRadius);
    pass(temp, result,  height, width, halfRadius);
    pass(result,  temp, width, height, halfRadius);
    pass(temp, result,  height, width, halfRadius);

    return result;
}