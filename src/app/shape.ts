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

    // maximum valid y value
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

    /**
     * sets x position of the shape
     * @param posX x position
     */
    protected setPosX(posX) {
        this._posX = posX;
    }

    /**
     * sets y position of the shape
     * @param posY y position
     */
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

    /**
     * get corners of the shape
     * @return [Array<number>] returns corner (x, y) points in a flat array
     */
    getCorners(): Array<number> {
        const x1 = this.posX - this.width / 2;
        const y1 = this.posY - this.height / 2;
        const x2 = this.posX + this.width / 2;
        const y2 = this.posY - this.height / 2;
        const x3 = this.posX + this.width / 2;
        const y3 = this.posY + this.height / 2;
        const x4 = this.posX - this.width / 2;
        const y4 = this.posY + this.height / 2;
        return [x1, y1, x2, y2, x3, y3, x4, y4];
    }

    abstract initPos(): void;

    /**
     * calculates intersection points of the shape with another shape
     * @param shape input shape to calculate the intersection with
     * @return [Array<number>] returns the intersection points
     */
    intersection (shape: Shape): Array<number> {
        const intersect = [];
        const p1 = this.getCorners();
        const p2 = shape.getCorners();
        const obj1 = [{x: p1[0], y: p1[1]}, {x: p1[2], y: p1[3]}, {x: p1[4], y: p1[5]}, {x: p1[6], y: p1[7]}];
        const obj2 = [{x: p2[0], y: p2[1]}, {x: p2[2], y: p2[3]}, {x: p2[4], y: p2[5]}, {x: p2[6], y: p2[7]}];
        polyIntersect(obj1, obj2).forEach(point => {
            intersect.push(point.x);
            intersect.push(point.y);
        });
        return intersect;
    }
}
