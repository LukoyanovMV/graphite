import { RGBA_SIZE } from '../../consts';
import { getMask2DFromRGBA } from '../../image_engine/mask';
import { ChamferDistance } from '../../image_engine/morph';
import { clamp, createCanvas } from '../../utils/';

export default (ctx, layer) => {
    const dist = [];
    const mask = [];
    const style = layer.styles.STROKE;
    

    if (!style.enabled) {
        return;
    }

    let size = style.size.value;
    const rect = layer.getRect();
    rect.expand(size);
    const imageData = ctx.getImageData(rect.l, rect.t, rect.w, rect.h);

    size = style.style !== 'center' ? size : size / 2;

    const dCnv = createCanvas(rect.w, rect.h);
    const dCtx = dCnv.getContext('2d');
    const dImageData = dCtx.getImageData(0, 0, rect.w, rect.h); 

    if (style.style === 'inset' || style.style === 'center') {
        mask.push(getMask2DFromRGBA(imageData.data, rect.w, rect.h, 3, true));
        dist.push(ChamferDistance(mask[mask.length-1], rect.w, rect.h));    
    } 
    if (style.style === 'outset' || style.style === 'center') {
        mask.push(getMask2DFromRGBA(imageData.data, rect.w, rect.h, 3, false));
        dist.push(ChamferDistance(mask[mask.length-1], rect.w, rect.h));    
    }

    const loops = style.style === 'center' ? 2 : 1;
    let alpha;
    let distance;

    for(let n = 0; n < loops; n++) {
        for (let j = 0; j < rect.h; j++) {
            for (let i = 0; i < rect.w; i++) {
                let index = (j * rect.w + i) * RGBA_SIZE;
                distance = dist[n][j][i];
    
                if (distance <= size * 256) {
                    alpha = 255;
                } else {
                    alpha = distance < (size + 1)*256
                        ? 256 - (distance - (size*256))
                        : 0;
                }
    
                if (style.style !== 'center') {
                    alpha = style.style === 'inset'
                        ? (alpha * (imageData.data[index + 3]))/256
                        : (alpha * (255 - imageData.data[index + 3]))/256;
                } else {
                    alpha = n === 0 
                        ? (alpha * (imageData.data[index + 3]))/256
                        : (alpha * (255 - imageData.data[index + 3]))/256;                    
                }
    
                if (alpha > 0) {
                    dImageData.data[index + 0] = style.color.r;
                    dImageData.data[index + 1] = style.color.g;
                    dImageData.data[index + 2] = style.color.b;
                    dImageData.data[index + 3] = blend(alpha, dImageData.data[index + 3]);    
                    
                    if (loops < 2 || n > 0) {
                        dImageData.data[index + 3] = (dImageData.data[index + 3]/100) * style.opacity.value;
                    } 
                }                
            }
        }    
    }

    dCtx.putImageData(dImageData, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = style.blendMode;
    ctx.drawImage(dCnv, rect.l, rect.t);
    ctx.restore();
};

const blend = (c1, c2, a1, a2) => {
    let out;
    if (a1) {
        out = (c1 * a1 / 255) + (c2 * a2 * (255 - a1) / (255*255));
    } else {
        out = c1 + (c2 * (255 - c1) / 255);   
    }
    return out;
}
