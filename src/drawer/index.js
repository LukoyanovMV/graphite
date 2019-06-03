import applyStyles from './styles/';
import {RGBA_SIZE, OPAQUE} from '../consts';
import {createCanvas} from '../utils';

class Drawer {
    constructor(psd) {
        this.psd = psd;
    }

    drawImageData() {
        const w = this.psd.getWidth();
        const h = this.psd.getHeight();
        const chNumber = this.psd.data.header.channelsNumber;
        const imageData = new ImageData(w, h);
        const data = this.psd.data.imageData;

        let index = 0;

        for (let i = 0, l = w * h; i < l; i++) {
            index = i * RGBA_SIZE;

            for (let j = 0; j < chNumber; j++) {
                imageData.data[index + j] = data[j][i];
            }
            if (chNumber < 4) {
                imageData.data[index + 3] = OPAQUE;
            }
        }

        return imageData;
    }

    drawToCanvas(canvas) {
        const w = this.psd.getWidth();
        const h = this.psd.getHeight();

        if (!canvas) {
            canvas = createCanvas(w, h);
        }

        const ctx = canvas.getContext('2d');
        ctx.putImageData(this.drawImageData(), 0, 0);

        return canvas;
    }

    drawLayerToCanvas(layer, clipping) {
        const psdW = this.psd.getWidth();
        const psdH = this.psd.getHeight();

        let canvas = createCanvas(this.psd.getWidth(), this.psd.getHeight());
        let ctx = canvas.getContext('2d');

        if (!layer) {
            layer = this.psd.layers;
        }

        if (layer.isFolder()) {
            layer.getChilds().forEach((l) => {
                ctx.drawImage(this.drawLayerToCanvas(l), 0, 0);
            });
        } else {
            const w = layer.width;
            const h = layer.height;

            let imageData;
            let opacity;
            let rgba = {};

            if (w === 0 || h === 0 /*|| !layer.isVisible*/) {
                return canvas;
            }

            let _cnv = createCanvas(psdW, psdH);
            let _ctx = _cnv.getContext('2d');
            imageData = new ImageData(w, h);

            rgba.r = layer.getChannelById(0);
            rgba.g = layer.getChannelById(1);
            rgba.b = layer.getChannelById(2);
            rgba.a = layer.getChannelById(-1);

            let index = 0;
            let layerOpacity = layer.getRealOpacity();

            for (let i = 0, l = w * h; i < l; i++) {
                index = i * RGBA_SIZE;
                opacity = rgba.a !== undefined ? this.calcOpacity(rgba.a.rawChData[i], layerOpacity) : this.calcOpacity(OPAQUE, layerOpacity);
                imageData.data[index + 0] = rgba.r.rawChData[i];
                imageData.data[index + 1] = rgba.g.rawChData[i];
                imageData.data[index + 2] = rgba.b.rawChData[i];
                imageData.data[index + 3] = opacity;
            }

            _ctx.putImageData(imageData, layer.left, layer.top);
            applyStyles(_ctx, layer);
            ctx.drawImage(_cnv, 0, 0);
        }

        return canvas;
    }

    calcOpacity(val, op) {
        return Math.round(val * op);
    }
};

export default Drawer;
