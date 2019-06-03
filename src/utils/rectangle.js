export default class Rectangle {
    constructor(left = 0, top = 0, width = 0, height = 0) {
        this.w = width;
        this.h = height;
        this.l = left;
        this.t = top;
    }

    get width() {
        return this.w;
    }

    get height() {
        return this.w;
    }

    get left() {
        return this.w;
    }

    get top() {
        return this.w;
    }

    expand(size = 0) {
        this.w += size * 2;
        this.h += size * 2;
        this.l -= size;
        this.t -= size;
    }

    collapse(size = 0) {
        this.w -= size * 2;
        this.h -= size * 2;
        this.l += size;
        this.t += size;
    }

    translate(x, y) {
        this.l += x;
        this.t += y;        
    }
}