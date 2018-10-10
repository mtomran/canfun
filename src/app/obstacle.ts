import { Shape } from './shape';
export class Obstacle extends Shape {
    constructor(options) {
        super(options);
    }

    initPos(): void {}

    /**
     * generates an x position for obstacle
     * @param index index of the portion to be used to bound the value
     * @param step size of each portion in pixels
     */
    generateObstaclePosX(index: number, step: number): number {
        const l = index * step;
        const h = (index + 1) * step;
        return this.randomRange(l, h);
    }

    /**
     * generates a y position for obstacle
     * @param index index of the portion to be used to bound the value
     * @param step size of each portion in pixels
     */
    generateObstaclePosY(index: number, step: number): number {
        const l = index * step;
        const h = (index + 1) * step;
        return this.randomRange(l, h);
    }

    /**
     * generates a random (x, y) position inside a given virtual box for better overall distribution
     * @param i index of virtual box on x axel
     * @param j index of virtual box on y axel
     * @param stepX width of the virtual box
     * @param stepY height of the virtual box
     */
    generateObstaclePosXY(i: number, j: number, stepX: number, stepY: number): void {
        const x = this.generateObstaclePosX(i, stepX);
        const y = this.generateObstaclePosY(j, stepY);
        this.setPosXY(x, y);
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
