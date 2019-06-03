import {RGBA_SIZE, CHANNEL_INDEX} from '../consts';
import { Map2D } from './common';

export const getMask2DFromRGBA = (dataRGBA, width, height, channel=CHANNEL_INDEX.A, invers = false) => {
    const mask = Map2D(width, height, 0);
    let index = 0; 
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            index = (j * width + i) * RGBA_SIZE;
            mask[j][i] = invers ? 255 - dataRGBA[index + channel] : dataRGBA[index + channel];
        }            
    }

    return mask;
}

