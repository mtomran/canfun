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
  private _gameCanvas: GameCanvas;

  get gameCanvas(): GameCanvas {
    return this._gameCanvas;
  }

  constructor() {}

  ngOnInit() {
    // initialized on component initialization to make sure element is in DOM
    this._gameCanvas = new GameCanvas('canvas-func');
  }


  /**
   * handles keydown event to start car movement
   * @param event keydown even
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    console.log('Start', event, event.key);
    switch (event.key) {
      case 'ArrowUp':
        this.gameCanvas.car.startForwardMove();
        break;
      case 'ArrowDown':
        this.gameCanvas.car.startBackwardMove();
        break;
      case 'ArrowRight':
        this.gameCanvas.car.startRightTurn();
        break;
      case 'ArrowLeft':
        this.gameCanvas.car.startLeftTurn();
        break;
    }
  }

  /**
   * handles keyup event to stop car movement
   * @param event keyup even
   */
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    console.log('End', event.key);
    switch (event.key) {
      case 'ArrowUp':
        this.gameCanvas.car.stopMove();
        break;
      case 'ArrowDown':
        this.gameCanvas.car.stopMove();
        break;
      case 'ArrowRight':
        this.gameCanvas.car.stopTurn();
        break;
      case 'ArrowLeft':
        this.gameCanvas.car.stopTurn();
        break;
    }
  }
}
