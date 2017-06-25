import { Component, OnInit } from '@angular/core';

import { LoginService } from '../login/login.service';
import { GameService } from './game.service';

@Component({
    selector: 'game-comp',
    templateUrl: 'assets/html/Scrabble.html',
    styleUrls: ['assets/css/scrabble.css']

})

export class GameComponent implements OnInit {

    constructor(private gameService: GameService, private loginService: LoginService) { }

    ngOnInit() {
        this.gameService.initGameData();
    }
}

