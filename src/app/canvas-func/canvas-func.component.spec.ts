import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasFuncComponent } from './canvas-func.component';

describe('CanvasFuncComponent', () => {
  let component: CanvasFuncComponent;
  let fixture: ComponentFixture<CanvasFuncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasFuncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasFuncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show proper initial x, y position and heading', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.life-count-value').textContent).toContain(component.gameCanvas.lifeCount);
    expect(compiled.querySelector('.x-pos-value').textContent).toContain(component.gameCanvas.car.posX);
    expect(compiled.querySelector('.y-pos-value').textContent).toContain(component.gameCanvas.car.posY);
    expect(compiled.querySelector('.heading-value').textContent).toContain(component.gameCanvas.car.heading);
  }));

  it('should change position value when car moves', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.gameCanvas.car.setPosXY(100, 140);
    fixture.detectChanges();
    expect(compiled.querySelector('.x-pos-value').textContent).toContain(100);
    expect(compiled.querySelector('.y-pos-value').textContent).toContain(140);
  }));

  it('should change heading value when car turns', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.gameCanvas.car.setHeading(120);
    fixture.detectChanges();
    expect(compiled.querySelector('.heading-value').textContent).toContain(120);
  }));

  it('should update life count if car goes to an obstacle', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const lifeCount = component.gameCanvas.lifeCount;
    component.gameCanvas.car.setPosXY(component.gameCanvas.obstacles[0].posX, component.gameCanvas.obstacles[0].posY);
    fixture.detectChanges();
    expect(compiled.querySelector('.life-count-value').textContent).toBeLessThan(lifeCount);

    // given the distribution pattern only car can hit at most 4 obstacles at the same time,
    expect(compiled.querySelector('.life-count-value').textContent).toBeGreaterThanOrEqual(lifeCount - 4);
  }));

  it('should eventually show lost game text when hit enough obstacles', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const lifeCount = component.gameCanvas.lifeCount;
    const obstacleCnt = component.gameCanvas.obstacles.length;
    for (let i = 0; i < lifeCount; ++i ) {
      const index = i % obstacleCnt;
      component.gameCanvas.car.setPosXY(component.gameCanvas.obstacles[index].posX, component.gameCanvas.obstacles[index].posY);
      fixture.detectChanges();
    }

    expect(compiled.querySelector('.lose-text').textContent).toBeTruthy();
    expect(compiled.querySelector('.lose-text').textContent).toContain('You lost');
  }));

  it('should not show the winning text if car is not fully in the parking', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.gameCanvas.car.setHeading(90);
    component.gameCanvas.car.setPosXY(component.gameCanvas.parking.posX, component.gameCanvas.parking.posY);
    fixture.detectChanges();
    expect(compiled.querySelector('.win-text')).toBeNull();
  }));

  it('should not move the car after game is lost', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const lifeCount = component.gameCanvas.lifeCount;
    const obstacleCnt = component.gameCanvas.obstacles.length;
    for (let i = 0; i < lifeCount; ++i ) {
      const index = i % obstacleCnt;
      component.gameCanvas.car.setPosXY(component.gameCanvas.obstacles[index].posX, component.gameCanvas.obstacles[index].posY);
      fixture.detectChanges();
    }

    const posX = component.gameCanvas.car.posX;
    const posY = component.gameCanvas.car.posY;

    component.gameCanvas.car.setPosXY(posX + 1, posY + 1);
    fixture.detectChanges();
    expect(compiled.querySelector('.x-pos-value').textContent).toEqual(posX.toString());
    expect(compiled.querySelector('.y-pos-value').textContent).toEqual(posY.toString());
  }));

  it('should not move the car after game is won', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const lifeCount = component.gameCanvas.lifeCount;
    component.gameCanvas.car.setPosXY(component.gameCanvas.parking.posX, component.gameCanvas.parking.posY);
    fixture.detectChanges();
    const posX = component.gameCanvas.car.posX;
    const posY = component.gameCanvas.car.posY;

    component.gameCanvas.car.setPosXY(posX + 1, posY + 1);
    fixture.detectChanges();
    expect(compiled.querySelector('.x-pos-value').textContent).toEqual(posX.toString());
    expect(compiled.querySelector('.y-pos-value').textContent).toEqual(posY.toString());
  }));

  it('should show the winning text if car moves to parking', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.gameCanvas.car.setHeading(180);
    component.gameCanvas.car.setPosXY(component.gameCanvas.parking.posX, component.gameCanvas.parking.posY);
    fixture.detectChanges();
    expect(compiled.querySelector('.win-text')).toBeTruthy();
  }));

  it('should move the car forward if ArrowUp is pressed', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const timeSteps = 4; // number of cycles to run trigger move
    const pressTime = component.gameCanvas.car.moveIntervalTimer * timeSteps;
    const stepsPixel = component.gameCanvas.car.moveIntervalSteps;

    const posX = component.gameCanvas.car.posX;
    const posY = component.gameCanvas.car.posY;
    const width = component.gameCanvas.car.width;
    const height = component.gameCanvas.car.height;

    // get pixel color near the bottom of the car
    const db = component.gameCanvas._ctx.getImageData(posX + width / 2 - 2, posY + height / 2 - 2 , 1, 1).data;

    // expect color to be solid red
    expect ([255, 0, 0, 255]).toEqual([db[0], db[1], db[2], db[3]]);

    const keydownEvent = new KeyboardEvent('keydown', {
      'key': 'ArrowUp'
    });
    window.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      'key': 'ArrowUp'
    });

    setTimeout(() => {
      window.dispatchEvent(keyupEvent);
      fixture.detectChanges();
      expect(compiled.querySelector('.x-pos-value').textContent).toContain(posX);
      expect(compiled.querySelector('.y-pos-value').textContent).toContain(posY - timeSteps * stepsPixel);

      // get pixel color at old position
      const da = component.gameCanvas._ctx.getImageData(posX + width / 2 - 2, posY + height / 2 - 2 , 1, 1).data;

      // get pixel color at translated location
      const dx = component.gameCanvas._ctx.getImageData(posX + width / 2 - 2, posY + height / 2 - 2 - timeSteps * stepsPixel , 1, 1).data;

      // expect old pixel to be different after car moves
      expect(dx).not.toEqual(da);

      // expect translated pixel to be solid red
      expect(dx).toEqual(db);
    }, pressTime);
  }));

  it('should move the car backward if ArrowDown is pressed', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const timeSteps = 4; // number of cycles to run trigger move
    const pressTime = component.gameCanvas.car.moveIntervalTimer * timeSteps;
    const stepsPixel = component.gameCanvas.car.moveIntervalSteps;

    const posX = component.gameCanvas.car.posX;
    const posY = component.gameCanvas.car.posY;
    component.gameCanvas.car.setHeading(270);

    const keydownEvent = new KeyboardEvent('keydown', {
      'key': 'ArrowDown'
    });
    window.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      'key': 'ArrowDown'
    });

    setTimeout(() => {
      window.dispatchEvent(keyupEvent);
      fixture.detectChanges();
      expect(compiled.querySelector('.x-pos-value').textContent).toContain(posX + timeSteps * stepsPixel);
      expect(compiled.querySelector('.y-pos-value').textContent).toContain(posY);
    }, pressTime);
  }));

  it('should turn the car to right if ArrowRight is pressed', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const timeSteps = 4; // number of cycles to run trigger turn
    const pressTime = component.gameCanvas.car.turnIntervalTimer * timeSteps;
    const stepsPixel = component.gameCanvas.car.turnIntervalSteps;

    const posX = component.gameCanvas.car.posX;
    const posY = component.gameCanvas.car.posY;
    const heading = component.gameCanvas.car.heading;

    const keydownEvent = new KeyboardEvent('keydown', {
      'key': 'ArrowRight'
    });
    window.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      'key': 'ArrowRight'
    });

    setTimeout(() => {
      window.dispatchEvent(keyupEvent);
      fixture.detectChanges();
      expect(compiled.querySelector('.x-pos-value').textContent).toContain(posX);
      expect(compiled.querySelector('.y-pos-value').textContent).toContain(posY);
      expect(compiled.querySelector('.heading-value').textContent).toContain(heading + timeSteps * stepsPixel);
    }, pressTime);
  }));

  it('should turn the car to right if ArrowLeft is pressed', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    const timeSteps = 4; // number of cycles to run trigger turn
    const pressTime = component.gameCanvas.car.turnIntervalTimer * timeSteps;
    const stepsPixel = component.gameCanvas.car.turnIntervalSteps;

    const posX = component.gameCanvas.car.posX;
    const posY = component.gameCanvas.car.posY;
    const heading = component.gameCanvas.car.heading;

    const keydownEvent = new KeyboardEvent('keydown', {
      'key': 'ArrowLeft'
    });
    window.dispatchEvent(keydownEvent);

    const keyupEvent = new KeyboardEvent('keyup', {
      'key': 'ArrowLeft'
    });

    setTimeout(() => {
      window.dispatchEvent(keyupEvent);
      fixture.detectChanges();
      expect(compiled.querySelector('.x-pos-value').textContent).toContain(posX);
      expect(compiled.querySelector('.y-pos-value').textContent).toContain(posY);
      expect(compiled.querySelector('.heading-value').textContent).toContain(heading + 360 - timeSteps * stepsPixel);
    }, pressTime);
  }));

});
