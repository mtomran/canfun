import { Component, OnInit } from '@angular/core';
import { Car } from '../car';
import { GameCanvas } from '../game-canvas';

import {HostListener} from '@angular/core';


@Component({
  selector: 'app-canvas-func',
  templateUrl: './canvas-func.component.html',
  styleUrls: ['./canvas-func.component.css']
})
export class CanvasFuncComponent implements OnInit {
  private _car = new Car(30, 80);
  private _gameCanvas: GameCanvas;

  get car(): Car {
    return this._car;
  }

  get gameCanvas(): GameCanvas {
    return this._gameCanvas;
  }

  constructor() {}

  ngOnInit() {
    this._gameCanvas = new GameCanvas('canvas-func', this._car);
    this.car.limitX = this._gameCanvas.width;
    this.car.limitY = this._gameCanvas.height;
    this.draw();
  }

  draw() {
    this.gameCanvas.draw();
    this.car.onMoveEvent()
    .subscribe(() => {
      console.log('car moved. now drawing');
      this.gameCanvas.draw();
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    console.log('Start', event, event.key);
    switch (event.key) {
      case 'ArrowUp':
        this._car.startForwardMove();
        break;
      case 'ArrowDown':
        this._car.startBackwardMove();
        break;
      case 'ArrowRight':
        this._car.startRightTurn();
        break;
      case 'ArrowLeft':
        this._car.startLeftTurn();
        break;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    console.log('End', event.key);
    switch (event.key) {
      case 'ArrowUp':
        this._car.stopMove();
        break;
      case 'ArrowDown':
        this._car.stopMove();
        break;
      case 'ArrowRight':
        this._car.stopTurn();
        break;
      case 'ArrowLeft':
        this._car.stopTurn();
        break;
    }
  }
}
