export class ResizeHandler {
    sizeRatio: number;

    constructor() {
        this.sizeRatio = 0;
    }

    set ratio(n) {
        this.sizeRatio = n;
    }
}