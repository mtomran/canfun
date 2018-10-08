import { Shape } from './shape';
export class Obstacle extends Shape {
    constructor(width: number, height: number) {
        super(width, height);
    }

    getCorners(): Array<number> {
        return [];
    }
}
