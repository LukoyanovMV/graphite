import ArrayReader from '../utils/array_reader';

export const decodeRLE = (data, width, height, byteCounts) => {
    const lineReader = new ArrayReader(data);
    let rawData = new Uint8Array(width * height);

    let lineByteCount;
    let line;
    let secLen = 0;
    let writePos = 0;


    for (let j = 0; j < height; j++) {
        lineByteCount = byteCounts[j];
        line = lineReader.read(lineByteCount);

        let readPos = 0;
        let val;

        while (readPos < lineByteCount) {
            secLen = line[readPos];

            if (secLen < 128) {
                secLen += 1;
                readPos += 1;
                rawData.set(line.slice(readPos, secLen + readPos), writePos);
                readPos += secLen;
            } else {
                secLen ^= 0xff;
                secLen += 2;
                val = new Uint8Array(secLen);
                val.fill(line[readPos + 1]);
                rawData.set(val, writePos);
                readPos += 2;
            }

            writePos += secLen;
        }
    }
    return rawData;
};

export const encodeRLE = (data, width, height, byteCounts) => {
    console.log('encodeRLE not prsented');
};
