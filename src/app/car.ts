import { Observable } from 'rxjs';

export class Car {
    // car width
    private _width = 20;

    // car height;
    private _height = 100;

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

    // car x position
    private _posX = 0;

    // car y position
    private _posY = 0;

    // car heading direction
    private _heading = 0;

    // car speed in pixels in second
    private _speed = 100;

    private _turnInterval = null;
    private _turnIntervalTimer = 50; // turn interval timer in milliseconds
    private _turnIntervalSteps = 5; // turn steps in degrees

    private _moveInterval = null;
    private _moveIntervalTimer = 50; // move interval timer in milliseconds
    private _moveIntervalSteps = this._speed * this._moveIntervalTimer / 1000; // move steps in pixels

    private _observer;

    private _observable = Observable.create(observer => this._observer = observer);

    constructor(width, height) {
        this._width = width;
        this._height = height;
        this.initPos();
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get speed(): number {
        return this._speed;
    }

    set speed(speed) {
        this._speed = speed;
    }

    get posX(): number {
        return this._posX;
    }

    get posY(): number {
        return this._posY;
    }

    get heading(): number {
        return this._heading;
    }

    private setPosX(posX) {
        this._posX = posX;
    }

    private setPosY(posY) {
        this._posY = posY;
    }

    private setHeading(heading) {
        this._heading = heading;
    }

    /**
     * initializes car position
     */
    initPos() {
        this.setPosX(this.width / 2);
        this.setPosY(this.height / 2);
    }

    /**
     * checks if car position is within the border
     * @param posX x position pixel
     * @param posY y position pixel
     * @param heading heading angle
     */
    isPosValid(posX: number, posY: number, heading: number): boolean {
        if (this.limitX && (posX < 0 || posX > this.limitX)) {
            return false;
        }

        if (this.limitY && (posY < 0 || posY > this.limitY)) {
            return false;
        }
        return true;
    }

    /**
     * sets the cars (x, y) position and heading
     * @param x car x position
     * @param y car y position
     * @param h car heading angle
     */
    moveTo(x = this.posX, y= this.posY, h= this.heading): boolean {
        if (this.isPosValid(x, y, h)) {
            this.setPosX(x);
            this.setPosY(y);
            this.setHeading(h);
            console.log(`car moved to x=${x} y= ${y} h=${h}`);
            this._observer.next();
        }

        return false;
    }

    /**
     * returns movement event observable
     */
    onMoveEvent(): Observable<void> {
        return this._observable;
    }

    /**
     * starts moving forward
     */
    startForwardMove(): void {
        this.startMove(1);
    }

    /**
     * starts moving backward
     */
    startBackwardMove(): void {
        this.startMove(-1);
    }

    /**
     * starts movement and continues until stopped
     * @param sign movement direction; +1 forward, -1 backward
     */
    private startMove(sign: number): void {
        if (this._moveInterval) {
            console.warn('The car is already moving.');
            return;
        }

        let x = this.posX;
        let y = this.posY;
        this._moveInterval = setInterval(() => {
            const h = this.heading;
            x = x + Math.round(sign * this._moveIntervalSteps * Math.sin(Math.PI / 180 * h));
            y = y + Math.round(-sign * this._moveIntervalSteps * Math.cos(Math.PI / 180 * h));
            this.moveTo(x, y, undefined);
        }, this._moveIntervalTimer);
    }

    /**
     * stops forward/backward movement
     */
    stopMove(): void {
        clearInterval(this._moveInterval);
        this._moveInterval = null;
    }

    /**
     * starts right turning
     */
    startRightTurn(): void {
        this.startTurn(1);
    }

    /**
     * starts left turning
     */
    startLeftTurn(): void {
        this.startTurn(-1);
    }

    /**
     * start the turn and continue until stopped
     * @param sign right(+1) of left(-1) turn
     */
    private startTurn(sign: number) {
        if (this._turnInterval) {
            console.warn('The car is already turning.');
            return;
        }
        const x = this.posX;
        const y = this.posY;
        let h = this.heading;
        this._turnInterval = setInterval(() => {
            h = (h + sign * this._turnIntervalSteps) % 360;
            h = (h < 0) ? 360 + h : h;
            this.moveTo(undefined, undefined, h);
        }, this._turnIntervalTimer);
    }

    /**
     * stops turning
     */
    stopTurn() {
        clearInterval(this._turnInterval);
        this._turnInterval = null;
    }

}
