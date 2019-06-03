import { RGBA_SIZE } from '../../consts';
import { clamp, createCanvas } from '../../utils/';
import { 
    GrayscaleErosion, 
    BoxBlurAndDilateSettings,
    boxBlur
 } from '../../image_engine/morph';
import { getMask2DFromRGBA } from '../../image_engine/mask';

const PI = Math.PI;

export default (ctx, layer) => {
    const style = layer.styles.INNER_SHADOW;
    
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

    const bd = BoxBlurAndDilateSettings(style.size.value, style.choke.value);
    const mask = getMask2DFromRGBA(imageData.data, rect.w, rect.h, 3, false);
    const dist = GrayscaleErosion(mask, rect.w, rect.h, bd.getDilatePixels()); 
    const blur = boxBlur(dist, rect.w, rect.h, bd.getBoxBlurRadius());

    for (let j = 0; j < rect.h; j++) {
        for (let i = 0; i < rect.w; i++) {
            let index = (j * rect.w + i) * RGBA_SIZE;
            let origIndex = ((j + yOffset) * rect.w + (i + xOffset)) * RGBA_SIZE;

            let alpha = ( blur.getV(i,j)/256 ) * style.opacity.value / 100
            let srcAlpha = imageData.data[origIndex + 3];
            alpha = srcAlpha > 0 ? (alpha)*srcAlpha/255 : 0;

            dImageData.data[index + 0] = style.color.r;
            dImageData.data[index + 1] = style.color.g;
            dImageData.data[index + 2] = style.color.b;
            dImageData.data[index + 3] = alpha;                        
        }
    }    

    dCtx.putImageData(dImageData, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = style.blendMode;
    ctx.drawImage(dCnv, rect.l + xOffset, rect.t + yOffset);
    ctx.restore();
};

