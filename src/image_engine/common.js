export const Map2D = (w, h, fillValue = 0) => {
    const res = [];
    let row;
    for(let j = 0; j < h; j++) {
        row = new Int32Array(w);
        if (fillValue) {
            row.fill(fillValue);
        }
        res.push(row);
    }
    res.setV = function(x,y,v) {
        this[y][x] = v;
    }
    res.getV = function(x,y) {
        return this[y][x];
    }

    return res;
}