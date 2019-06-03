import ArrayReader from '../utils/array_reader';

export default function headerParser(data) {
    const reader = new ArrayReader(data);
    return {
        signature: reader.readStr(4),
        version: reader.readWord(),
        fillers: reader.read(6),
        channelsNumber: reader.readWord(),
        height: reader.readInt(),
        width: reader.readInt(),
        depth: reader.readWord(),
        colorMode: reader.readWord()
    };
}
