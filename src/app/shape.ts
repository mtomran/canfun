import * as polyIntersect from 'polygons-intersect';
export abstract class Shape {
    // shape width
    private _width = 20;
    get width(): number {
        return this._width;
    }

    // shape height;
    private _height = 100;
    get height(): number {
        return this._height;
    }

    // maximum valid x value
    private _limitX = null;
    get limitX(): number {
        return this._limitX;
    }
    set limitX(lx) {
        this._limitX = lx;
    }

    // maximum valid y valu
    private _limitY = null;
    get limitY(): number {
        return this._limitY;
    }
    set limitY(ly) {
        this._limitY = ly;
    }

    // shape x position
    private _posX = 0;
    get posX(): number {
        return this._posX;
    }

    // shape y position
    private _posY = 0;
    get posY(): number {
        return this._posY;
    }

    protected setPosX(posX) {
        this._posX = posX;
    }

    protected setPosY(posY) {
        this._posY = posY;
    }

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    /**
     * checks if car position is within the border
     * @param posX x position pixel
     * @param posY y position pixel
     */
    isPosValid(posX: number, posY: number): boolean {
        if (this.limitX && (posX < 0 || posX > this.limitX)) {
            return false;
        }

        if (this.limitY && (posY < 0 || posY > this.limitY)) {
            return false;
        }
        return true;
    }

    protected setPosXY(x: number, y: number): boolean {
        if (this.isPosValid(x, y)) {
            this.setPosX(x);
            this.setPosY(y);
            console.log(`shape moved to x=${x} y= ${y}`);
            return true;
        }

        return false;
    }

    abstract getCorners(): Array<number>;

    intersects (shape: Shape): boolean {
        const poly1 = this.getCorners();
        const poly2 = shape.getCorners();
        return polyIntersect(poly1, poly2).length;
    }
}
