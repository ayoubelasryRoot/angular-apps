import { Component, Output, EventEmitter } from '@angular/core';
import { GameService } from './game.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'timer-comp',
  templateUrl: 'assets/html/timer.html',
  styleUrls: ['assets/css/scrabble.css']
})

export class TimerComponent {

  @Output() changeTurnsEvent = new EventEmitter();

  chronometreM: number;
  chronometreS: number;
  chronometre0: string;
  touractive: string;
  temps: number;
  private changeTimer: Subscription;

  constructor(private gameService: GameService) {

    this.chronometre0 = '0';
    this.chronometreS = 0;
    this.chronometreM = 5;
    this.changeTimer = this.gameService.changeTime().subscribe((data: { newMinutes: number, newSeconds: number }) => {

      if (data.newSeconds < 10) {
        this.chronometre0 = '0';
      } else { this.chronometre0 = ''; }
      this.chronometreM = data.newMinutes;
      this.chronometreS = data.newSeconds;
    });

  }
}
