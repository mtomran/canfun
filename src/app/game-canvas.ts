import { Car } from './car';
import { Obstacle } from './obstacle';
import { Parking } from './parking';
import { Shape } from './shape';

export class GameCanvas {
    _ctx: CanvasRenderingContext2D;

    // car object
    _car: Car;
    get car(): Car {
        return this._car;
    }

    // parking object
    _parking: Parking;
    get parking(): Parking {
        return this._parking;
    }

    // default number of obstacles;
    _obstacleCount = 25;
    get obstacleCount(): number {
        return this._obstacleCount;
    }

    // array of obstacle objects
    _obstacles: Array<Obstacle>;
    get obstacles(): Array<Obstacle> {
        return this._obstacles;
    }

    // default length of an obstacle in pixels
    _obstacleLength = 50;
    get obstacleLength(): number {
        return this._obstacleLength;
    }

    // winning status of the game
    _winner = false;
    get winner(): boolean {
        return this._winner;
    }

    // number of remaining lives to play
    _lifeCount = 10;
    get lifeCount(): number {
        return this._lifeCount;
    }

    // size of margin for showing border line warning
    _boundaryWarningThreshold = 10;

    // gets width of the board
    get width(): number {
        return this._ctx.canvas.width;
    }

    // gets height of the board
    get height(): number {
        return this._ctx.canvas.height;
    }

    constructor(elementId: string) {
        // initialize canvas context
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

        // initialize car object
        this._car = new Car({
            limitX: this.width,
            limitY: this.height,
            onMoveEvent: () => {
                this.checkStatus();
                this.draw();
            }
        });

        // initialize obstacles
        this._obstacles = this.generateObstacles();

        // initialize parking object
        this._parking = new Parking({
            width: this.car.width + 10,
            height: this.car.height + 10,
            limitX: this.width,
            limitY: this.height,
        });

        // initialize parking position
        this.parking.initPos();

        // initialize car position
        this.car.initPos();
    }

    /**
     * checks the status of the game upon movement
     */
    checkStatus() {
        // check if car is in the parking
        if (this.parking.isInside(this.car)) {
            this._winner = true;

            // turn off the car if won the game
            this.car.engineOn = false;
        }

        // check if any of the obstacles was hit
        this.obstacles.forEach(obstacle => {
            if (obstacle.intersection(this.car).length > 0) {
                this._lifeCount--;
            }
        });

        // turn off the car if game is lost
        if (this.lifeCount < 1) {
            this.car.engineOn = false;
        }
    }


    /**
     * draws the game board
     */
    draw() {
        this.clearCanvas();
        this.drawBoundaryWarning();
        this.drawObstacles();
        this.drawCar();
        this.drawParking();
    }

    /**
     * draws the car
     */
    drawCar() {
        const car = this.car;
        this._ctx.save();

        // translate and rotate coordinate
        this._ctx.translate(car.posX, car.posY);
        this._ctx.rotate((Math.PI / 180) * car.heading);

        // draw rectangle
        this.drawShapeRect(car);

        // draw triangle
        const w = car.width;
        const h = car.height;
        const x = -w / 2;
        const y = - h / 2;
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
     * draws the parking
     */
    drawParking() {
        this._ctx.save();
        this._ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        this._ctx.translate(this.parking.posX, this.parking.posY);
        this.drawShapeRect(this.parking);
        this._ctx.restore();
    }

    /**
     * draws obstacles in the context
     */
    drawObstacles(): void {
        this.obstacles.forEach(obstacle => {
            this._ctx.save();
            this._ctx.fillStyle = 'purple';
            this._ctx.translate(obstacle.posX, obstacle.posY);
            this.drawShapeRect(obstacle);
            this._ctx.restore();
        });
    }

    /**
     * draws a rectangle for a given shape
     * @param shape shape to be drawn
     */
    drawShapeRect(shape: Shape): void {
        const w = shape.width;
        const h = shape.height;
        const x = -w / 2;
        const y = -h / 2;
        this._ctx.fillRect(x, y, w, h);
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

        // generating randomly positioned obstacles inside smaller squares for better distribution
        for (let i = 0; i < len; ++i) {
            for (let j = 0; j < len; ++j) {
                if ( (i === 0 && j === 0) || (i === len - 1 && j === len - 1)) {
                    continue;
                }
                const obstacle = new Obstacle({
                    width: this.obstacleLength,
                    height: this.obstacleLength
                });
                obstacle.generateObstaclePosXY(i, j, stepX, stepY);
                obstacles.push(obstacle);
            }
        }
        return obstacles;
    }
}
