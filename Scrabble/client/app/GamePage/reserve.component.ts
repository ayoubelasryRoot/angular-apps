import { Component } from '@angular/core';
import { GameService } from './game.service';
import { Subscription } from "rxjs";

@Component({
    selector: 'reserve-comp',
    templateUrl: 'assets/html/reserve.html',
    styleUrls: ['assets/css/scrabble.css']
})

export class ReserveComponent{
    private remainingLetters : number;

    private updateReserveSub: Subscription;

    constructor(private gameService : GameService){
        this.updateReserveSub = this.gameService.updateReserve().subscribe((data: any) => {
            this.remainingLetters = data;
        });
    }
}
