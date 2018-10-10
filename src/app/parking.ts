import { Shape } from './shape';
export class Parking extends Shape {

    /**
     * initializes parking position
     */
    initPos(): void {
        this.setPosXY(this.limitX - this.width / 2, this.limitY - this.height / 2);
    }

    /**
     * checks whether or not a given shape is inside the parking
     * @param shape shape to be checked
     */
    isInside(shape: Shape): boolean {
        const intersect = shape.intersection(this);
        let inParking = true;

        // checking if intersection coordinates are the same as the shape coordinates
        // in which case shape is inside the parking
        shape.getCorners().forEach((element, i) => {
            if (element !== intersect[i]) {
                inParking = false;
            }
        });
        return inParking;
    }
}
