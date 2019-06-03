import { RGBA_SIZE } from '../../consts';
import { clamp, createCanvas } from '../../utils/';
import { 
    GrayscaleDilation, 
    BoxBlurAndDilateSettings,
    boxBlur
 } from '../../image_engine/morph';
import { getMask2DFromRGBA } from '../../image_engine/mask';


const PI = Math.PI;

export default (ctx, layer) => {
    const style = layer.styles.DROP_SHADOW;

    if (style.useGlobalAngle) {
        style.angle.value = 90;
    }
    
    if (!style.enabled) {
        return;
    }

    const rect = layer.getRect();
    const buff = style.size.value + style.distance.value + style.choke.value;
    rect.expand(buff);

    const imageData = ctx.getImageData(rect.l, rect.t, rect.w, rect.h);

    const dCnv = createCanvas(rect.w, rect.h);
    const dCtx = dCnv.getContext('2d');
    const dImageData = dCtx.getImageData(0, 0, rect.w, rect.h); 

    const xOffset = Math.floor(- Math.cos(style.angle.value*PI/180) * style.distance.value + 0.5);
    const yOffset = Math.floor(Math.sin(style.angle.value*PI/180) * style.distance.value + 0.5);

    const bd    = BoxBlurAndDilateSettings(style.size.value, style.choke.value);
    const mask  = getMask2DFromRGBA(imageData.data, rect.w, rect.h, 3, false);
    const dist  = GrayscaleDilation(mask, rect.w, rect.h, bd.getDilatePixels()); 
    const blur  = boxBlur(dist, rect.w, rect.h, bd.getBoxBlurRadius());

    for (let j = 0; j < rect.h; j++) {
        for (let i = 0; i < rect.w; i++) {
            let index = (j * rect.w + i) * RGBA_SIZE;
            let origIndex = ((j + yOffset) * rect.w + (i + xOffset)) * RGBA_SIZE;

            let alpha = (blur.getV(i,j)/256 ) * style.opacity.value / 100

            dImageData.data[index + 0] = style.color.r;
            dImageData.data[index + 1] = style.color.g;
            dImageData.data[index + 2] = style.color.b;
            dImageData.data[index + 3] = alpha;                            
        }
    }    

    dCtx.putImageData(dImageData, 0, 0);
    
    const sCnv = createCanvas(ctx.canvas.width, ctx.canvas.height);
    const sCtx = sCnv.getContext('2d');
    sCtx.putImageData(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height), 0, 0);

    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = style.blendMode;
    ctx.drawImage(dCnv, rect.l + xOffset, rect.t + yOffset);
    ctx.restore();
    ctx.drawImage(sCnv, 0, 0);
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

