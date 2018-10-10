import { Shape } from './shape';
export class Parking extends Shape {
    getCorners(): Array<number> {
        return [];
    }

    initPos(): void {
        this.setPosXY(this.limitX - this.width, this.limitY - this.height);
    }
}
