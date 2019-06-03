import { RGBA_SIZE } from '../../consts';
import { createCanvas } from '../../utils/';

export default (ctx, layer) => {
    const style = layer.styles.COLOR_OVER;
    
    if (!style.enabled) {
        return;
    }

    const rect = layer.getRect();
    const imageData = ctx.getImageData(rect.l, rect.t, rect.w, rect.h);

    const dCnv = createCanvas(rect.w, rect.h);
    const dCtx = dCnv.getContext('2d');
    const dImageData = dCtx.getImageData(0, 0, rect.w, rect.h); 

    for (let j = 0; j < rect.h; j++) {
        for (let i = 0; i < rect.w; i++) {
            let index = (j * rect.w + i) * RGBA_SIZE;

            dImageData.data[index + 0] = style.color.r;
            dImageData.data[index + 1] = style.color.g;
            dImageData.data[index + 2] = style.color.b;
            dImageData.data[index + 3] = imageData.data[index + 3];                    
        }
    }    

    dCtx.putImageData(dImageData, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = style.blendMode;
    ctx.drawImage(dCnv, rect.l, rect.t);
    ctx.restore();
};

