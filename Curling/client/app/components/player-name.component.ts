import { Component, /*Input,*/ OnInit } from '@angular/core';
import { Player } from '../classes/player';

@Component({
  selector: 'player-name',
  template: `
    <div *ngIf="player">
      <label>name: </label>
      <input [(ngModel)]="player.name" placeholder="name"/>
      <button md-button color="primary" type="button" (click)="validatePlayerName()">Valider</button>
    </div>
  `
})

export class PlayerNameComponent implements OnInit{
    player: Player;
    constructor() {
        /*block empty*/
    }
    ngOnInit(): void {
        this.player = new Player();
        this.player.name = "";
    }

    validatePlayerName(): boolean {
        if (this.player.name === ""){
            return false;
        }
        return true;
    }
}
