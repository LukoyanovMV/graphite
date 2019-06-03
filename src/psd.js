import FileLoader from './file_loader';
import {readStr} from './utils/bytes_lib';
import PsdParser from './psd_parser';
import Layer from './layer';
import LayersCollection from './layers_collection';
import Darwer  from './drawer';

class Psd {
    constructor(fileUrl) {
        this.fileUrl = fileUrl;

        this._layers = [];
        this.layers = undefined;
        this.drawer = new Darwer(this);

        if (this.fileUrl) {
            this.load(this.fileUrl);
        }
    }

    checkSignature(data) {
        return readStr(data, 0, 4) === '8BPS';
    }

    load(fileUrl) {
        if (fileUrl && typeof fileUrl === 'string') {
            this.fileUrl = fileUrl;
        }

        return FileLoader.load(this.fileUrl)
            .then((fileData) => {
                if (!this.checkSignature(fileData)) {
                    console.error('PSDError: bad signature');
                    return;
                }

                this.parser = new PsdParser(fileData);
                this.data = this.parser.parse();

                // this.data.layersData.forEach((lData) => {
                //     this._layers.push(new Layer(lData));
                // });

                this.layers = new LayersCollection(this.data.layersData);
            });
    }

    getWidth() {
        return this.data ? this.data.header.width : 0;
    }

    getHeight() {
        return this.data ? this.data.header.height : 0;
    }

    toCanvas(canvas) {
        return this.drawer.drawToCanvas(canvas);
    }

    layersToCanvas() {
        return this.drawer.drawLayerToCanvas();
    }

    // renderLayersToCanvas(canvas) {
    //     const pixelOffset = 4;
    //     const psdW = this.getWidth();
    //     const psdH = this.getHeight();

    //     let layer;
    //     let imageData;
    //     let w, h;

    //     if (!canvas) {
    //         canvas = document.createElement('CANVAS');
    //         canvas.width = psdW;
    //         canvas.height = psdH;
    //     }

    //     const ctx = canvas.getContext('2d');

    //     for (let j = 0; j < this.layers.length; j++) {
    //         layer = this.layers[j];

    //         w = layer.width;
    //         h = layer.height;

    //         if (w === 0 || h === 0) {
    //             continue;
    //         }

    //         let _cnv = document.createElement('canvas');
    //         _cnv.width = w;
    //         _cnv.height = h;
    //         let _ctx = _cnv.getContext('2d');

    //         imageData = new ImageData(w, h);

    //         let rgba = {};
    //         rgba.r = layer.getChannelById(0);
    //         rgba.g = layer.getChannelById(1);
    //         rgba.b = layer.getChannelById(2);
    //         rgba.a = layer.getChannelById(-1);
    //         let opacity;

    //         let index = 0;

    //         for (let i = 0; i < w * h; i++) {
    //             index = i * pixelOffset;
    //             opacity = rgba.a !== undefined ? this.calcOpacity(rgba.a.rawChData[i], layer.opacity) : this.calcOpacity(255, layer.opacity);
    //             imageData.data[index + 0] = rgba.r.rawChData[i];
    //             imageData.data[index + 1] = rgba.g.rawChData[i];
    //             imageData.data[index + 2] = rgba.b.rawChData[i];
    //             imageData.data[index + 3] = opacity;
    //         }
    //         _ctx.putImageData(imageData, 0, 0);
    //         ctx.drawImage(_cnv, 0, 0, w, h, layer.left, layer.top, w, h);
    //     }

    //     return canvas;
    // }

    // calcOpacity(val, op) {
    //     return Math.round(val * op);
    // }

}

export default Psd;
