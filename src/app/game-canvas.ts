import { Car } from './car';
import { Obstacle } from './obstacle';
import { Parking } from './parking';

export class GameCanvas {
    _ctx: CanvasRenderingContext2D;

    _car: Car;
    get car(): Car {
        return this._car;
    }

    _parking: Parking;
    get parking(): Parking {
        return this._parking;
    }

    // default number of obstacles;
    _obstacleCount = 25;
    get obstacleCount(): number {
        return this._obstacleCount;
    }

    _obstacles: Array<Obstacle>;
    get obstacles(): Array<Obstacle> {
        return this._obstacles;
    }

    // default length of an obstacle in pixels
    _obstacleLength = 50;
    get obstacleLength(): number {
        return this._obstacleLength;
    }

    // size of margin for showing border line warning
    _boundaryWarningThreshold = 10;

    get width(): number {
        return this._ctx.canvas.width;
    }

    get height(): number {
        return this._ctx.canvas.height;
    }

    constructor(elementId: string) {
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

        this._car = new Car({
            limitX: this.width,
            limitY: this.height,
            onMoveEvent: () => {
                console.log('car moved. now drawing');
                this.draw();
            }
        });

        this._obstacles = this.generateObstacles();
        this._parking = new Parking({
            width: this.car.width + 10,
            height: this.car.height + 10,
            limitX: this.width,
            limitY: this.height,
        });
        this.parking.initPos();
        this.car.initPos();
    }



    /**
     * draws the game board
     */
    draw() {
        this.clearCanvas();
        this.drawBoundaryWarning();
        this.drawCar();
        this.drawObstacles();
        this.drawParking();
    }

    /**
     * draws the car
     */
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

    drawParking() {
        this._ctx.save();
        this._ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        const x = this.parking.posX;
        const y = this.parking.posY;
        const w = this.parking.width;
        const h = this.parking.height;
        this._ctx.fillRect(x, y, w, h);
        this._ctx.restore();
    }

    /**
     * draws obstacles in the context
     */
    drawObstacles(): void {
        this._ctx.save();
        this._ctx.fillStyle = 'purple';
        this.obstacles.forEach(obstacle => {
            const x = obstacle.posX;
            const y = obstacle.posY;
            const w = obstacle.width;
            const h = obstacle.height;
            this._ctx.fillRect(x, y, w, h);
        });
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

    /**
     * clears the main canvas
     */
    clearCanvas() {
        this._ctx.save();
        this._ctx.fillStyle = 'lightGrey';
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._ctx.restore();
    }

    /**
     * generates an array of randomly positioned obstacles
     */
    generateObstacles(): Array<Obstacle> {
        const obstacles = [];
        const len = Math.sqrt(this.obstacleCount);
        const stepX = this.width / len;
        const stepY = this.height / len;

        // generating obstacles inside a smaller squares for better distribution
        for (let i = 0; i < len; ++i) {
            for (let j = 0; j < len; ++j) {
                if ( (i === 0 && j === 0) || (i === len - 1 && j === len - 1)) {
                    continue;
                }
                const obstacle = new Obstacle({
                    width: this.obstacleLength,
                    height: this.obstacleLength
                });
                const x = this.generateObstaclePos(i, stepX);
                const y = this.generateObstaclePos(j, stepY);
                obstacle.setPosXY(x, y);
                obstacles.push(obstacle);
            }
        }
        return obstacles;
    }

    generateObstaclePos(index: number, step: number): number {
        const l = index * step;
        const h = (index + 1) * step;
        return this.randomRange(l, h) - this.obstacleLength / 2;
    }

    /**
     * returns a random number in a given range
     * @param l low range
     * @param h high range
     */
    randomRange(l: number, h: number): number {
        return Math.random() * (h - l) + l;
    }
}
