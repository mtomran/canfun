import * as polyIntersect from 'polygons-intersect';
export abstract class Shape {
    // shape width
    private _width = 30;
    get width(): number {
        return this._width;
    }

    // shape height;
    private _height = 80;
    get height(): number {
        return this._height;
    }

    // maximum valid x value
    private _limitX = null;
    get limitX(): number {
        return this._limitX;
    }

    // maximum valid y valu
    private _limitY = null;
    get limitY(): number {
        return this._limitY;
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

    // on move event handler
    private _onMoveEvent;
    set onMoveEvent(callback) {
        this._onMoveEvent = callback;
    }
    get onMoveEvent() {
        return this._onMoveEvent;
    }

    protected setPosX(posX) {
        this._posX = posX;
    }

    protected setPosY(posY) {
        this._posY = posY;
    }

    constructor(options) {
        this._width = options.width || this.width;
        this._height = options.height || this.height;
        this._limitX = options.limitX || null;
        this._limitY = options.limitY || null;
        this._onMoveEvent = options.onMoveEvent || null;
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

    /**
     * sets the (x, y) position and calls the event callback
     * @param x x position pixel
     * @param y y position pixel
     */
    setPosXY(x: number, y: number): void {
        if (this.isPosValid(x, y)) {
            this.setPosX(x);
            this.setPosY(y);
            console.log(`shape moved to x=${x} y= ${y}`);

            // running on move event callback if provided
            if (this.onMoveEvent) {
                this.onMoveEvent();
            }
        } else {
            console.warn(`invalid position: x=${x} y=${y}`);
        }
    }

    abstract getCorners(): Array<number>;

    abstract initPos(): void;

    intersects (shape: Shape): boolean {
        const poly1 = this.getCorners();
        const poly2 = shape.getCorners();
        return polyIntersect(poly1, poly2).length;
    }
}
