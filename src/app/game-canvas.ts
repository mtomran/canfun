import { Car } from './car';

export class GameCanvas {
    _ctx: CanvasRenderingContext2D;
    _car: Car;
    _boundaryWarningThreshold = 10;

    get width(): number {
        return this._ctx.canvas.width;
    }

    get height(): number {
        return this._ctx.canvas.height;
    }

    constructor (elementId: string, car: Car) {
        // draw lines of varying widths
        const canvasElm = <HTMLCanvasElement>document.getElementById(elementId);
        if (canvasElm && canvasElm.getContext) {
            const ctx = canvasElm.getContext('2d');
            if (ctx) {
                this._ctx = ctx;
            } else {
                throw new Error('Problem getting canvas context.');
            }
        } else {
            throw new Error('Canvas HTML element not found.');
        }

        this._car = car;
    }

    get car(): Car {
        return this._car;
    }

    draw() {
        this.clearCanvas();
        this.drawBoundaryWarning();
        this.drawCar();
    }

    drawCar() {
        const car = this.car;
        this._ctx.save();
        // draw rectangle
        const w = car.width;
        const h = car.height;

        // translate and rotate coordinate
        this._ctx.translate(car.posX, car.posY);
        this._ctx.rotate((Math.PI / 180) * car.heading);

        const x = -w / 2;
        const y = - h / 2;
        this._ctx.fillRect(x, y, w, h);

        // draw triangle
        this._ctx.fillStyle = 'red';
        this._ctx.beginPath();
        this._ctx.moveTo(x, y + h);
        this._ctx.lineTo(x + w, y + h);
        this._ctx.lineTo(x + w / 2, y);
        this._ctx.closePath();
        this._ctx.stroke();
        this._ctx.fill();
        this._ctx.restore();
    }

    /**
     * draws a rectangle around the boundary when car gets close to the border
     */
    drawBoundaryWarning(): void {
        const ctx = this._ctx;
        const thres = this._boundaryWarningThreshold;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        if (this.car.posX < thres ||
            this.car.posX > width - thres ||
            this.car.posY < thres ||
            this.car.posY > height - thres
        ) {
            ctx.save();
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = thres;
            ctx.strokeRect(thres / 2, thres / 2, width - thres, height - thres);
            ctx.restore();
        }
    }

    clearCanvas() {
        this._ctx.save();
        this._ctx.fillStyle = 'lightGrey';
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._ctx.restore();
    }
}
