import { Shape } from './shape';
export class Obstacle extends Shape {
    constructor(options) {
        super(options);
    }

    initPos(): void {}

    getCorners(): Array<number> {
        return [];
    }
}
