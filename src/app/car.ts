import { Observable } from 'rxjs';
import { Shape } from './shape';

export class Car extends Shape {


    // car heading direction
    private _heading = 0;
    get heading(): number {
        return this._heading;
    }

    // car speed in pixels in second
    private _speed = 100;
    get speed(): number {
        return this._speed;
    }
    set speed(speed) {
        this._speed = speed;
    }

    private _turnInterval = null;
    private _turnIntervalTimer = 50; // turn interval timer in milliseconds
    private _turnIntervalSteps = 5; // turn steps in degrees

    private _moveInterval = null;
    private _moveIntervalTimer = 50; // move interval timer in milliseconds
    private _moveIntervalSteps = this._speed * this._moveIntervalTimer / 1000; // move steps in pixels

    private _observer;

    private _observable = Observable.create(observer => this._observer = observer);

    constructor(width, height) {
        super(width, height);
        this.initPos();
    }

    private setHeading(heading) {
        this._heading = heading;
        console.log(`shape heading to ${heading}°`);
        this._observer.next();
    }

    /**
     * initializes car position
     */
    initPos() {
        this.setPosX(this.width / 2);
        this.setPosY(this.height / 2);
    }


    /**
     * sets the cars (x, y) position and heading
     * @param x car x position
     * @param y car y position
     */
    protected setPosXY(x: number, y: number): boolean {
        if (super.setPosXY(x, y)) {
            this._observer.next();
            return true;
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
            this.setPosXY(x, y);
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
            this.setHeading(h);
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
