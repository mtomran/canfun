import { Observable } from 'rxjs';
import { Shape } from './shape';
import { FunctionCall } from '@angular/compiler';

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

    // engine on/off status
    private _engineOn = true;
    get engineOn(): boolean {
        return this._engineOn;
    }
    set engineOn(state) {
        this._engineOn = state;
    }

    private _turnInterval = null; // holds reference to setInterval for turning
    private _turnIntervalTimer = 50; // turn interval timer in milliseconds
    get turnIntervalTimer(): number {
        return this._turnIntervalTimer;
    }

    private _turnIntervalSteps = 5; // turn steps in degrees
    get turnIntervalSteps(): number {
        return this._turnIntervalSteps;
    }

    private _moveInterval = null; // holds reference to setInterval for movements
    private _moveIntervalTimer = 50; // move interval timer in milliseconds
    get moveIntervalTimer(): number {
        return this._moveIntervalTimer;
    }

    private _moveIntervalSteps = this._speed * this._moveIntervalTimer / 1000; // move steps in pixels
    get moveIntervalSteps(): number {
        return this._moveIntervalSteps;
    }

    constructor(options) {
        super(options);
    }

    /**
     * get corners of the car
     * @return [Array<number>] returns corner (x, y) points in a flat array
     */
    getCorners(): Array<number> {
        const rad = Math.PI / 180 * this.heading;
        const px1 = this.height / 2 * Math.sin(rad);
        const px2 = this.width / 2 * Math.cos(rad);
        const py1 = this.height / 2 * Math.cos(rad);
        const py2 = this.width / 2 * Math.sin(rad);
        const x1 = this.posX + px1 - px2;
        const y1 = this.posY - py1 - py2;
        const x2 = this.posX + px1 + px2;
        const y2 = this.posY - py1 + py2;
        const x3 = this.posX - px1 + px2;
        const y3 = this.posY + py1 + py2;
        const x4 = this.posX - px1 - px2;
        const y4 = this.posY + py1 - py2;
        return [x1, y1, x2, y2, x3, y3, x4, y4];
    }

    /**
     * sets the heading value of the care
     * @param heading heading value in degrees
     */
    setHeading(heading) {
        if (this.engineOn) {
            this._heading = heading;
            console.log(`shape heading to ${heading}°`);
            this.onMoveEvent();
        } else {
            console.warn('Cannot move! Engine is OFF.');
        }
    }

    /**
     * initializes car position
     */
    initPos() {
        this.setPosXY(this.width / 2, this.height / 2);
    }

    /**
     * override car set position method to not run if engine is off
     * @param posX x position
     * @param posY y position
     */
    setPosXY(posX: number, posY: number): void {
        if (this.engineOn) {
            super.setPosXY(posX, posY);
        } else {
            console.warn('Cannot move! Engine is OFF.');
        }
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
            x = x + sign * this.moveIntervalSteps * Math.sin(Math.PI / 180 * h);
            y = y + -sign * this.moveIntervalSteps * Math.cos(Math.PI / 180 * h);
            x = Math.round(x * 100) / 100;
            y = Math.round(y * 100) / 100;
            this.setPosXY(x, y);
        }, this.moveIntervalTimer);
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
            h = (h + sign * this.turnIntervalSteps) % 360;
            h = (h < 0) ? 360 + h : h;
            this.setHeading(h);
        }, this.turnIntervalTimer);
    }

    /**
     * stops turning
     */
    stopTurn() {
        clearInterval(this._turnInterval);
        this._turnInterval = null;
    }
}
