import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from './player';

import { LoginService } from '../login/login.service';
import { GameService } from './game.service';
import * as Constant from '../StaticValue/constant';

import { Subscription } from "rxjs";

@Component({
    selector: 'info-comp',
    templateUrl: 'assets/html/infoPanel.html',
    styleUrls: ['assets/css/scrabble.css']

})

export class InfoPanelComponent implements OnInit {
    players: Player[] = [];
    myPlayer: Player;
    activePlayerIndex: number;
    isGameOver: boolean;

    chronometreM: number;
    chronometreS: number;
    chronometre0: string;
    touractive: string;
    temps: number;

    roomID: number;

    private updateScoreSub: Subscription;
    private updatePrioritySub: Subscription;
    private passTurnSub: Subscription;
    private endGameSub: Subscription;
    private annouceWinnerSub: Subscription;
    private playerLeftSub: Subscription;
    private disconnectionSub: Subscription;

    constructor(private loginService: LoginService, private gameService: GameService, private router: Router) { }

    ngOnInit() {
        this.activePlayerIndex = 0;
        this.isGameOver = false;
        this.gameService.getPlayers()[0].setPriority(1);   //turn goes to the first player
        this.players = this.gameService.getPlayers();
        this.myPlayer = this.gameService.getMyPlayer();
        this.roomID = this.gameService.getRoomID();
        if (this.gameService.myPlayer.getPriority() === 1) {
            this.gameService.initializeData();
        }
        this.subscriberHandlers();
    }

    private subscriberHandlers() {
        this.updatePrioritySub = this.gameService.updatePriority().subscribe((data: any) => {
            this.gameService.setPlayerTurn(0);
            this.touractive = 'nonactive';
            for (let i = 0; i < this.players.length; i++) {
                this.gameService.getPlayers()[i].setPriority(0);
                this.players[i].setPriority(0);
                if (this.gameService.getPlayers()[i].getName() ===
                    this.gameService.getPlayers()[data.newPlayer].getName()) {
                    this.gameService.getPlayers()[i].setPriority(1);
                    this.players[i].setPriority(1);
                }
            }

            if (this.gameService.getMyPlayer().getName() === this.gameService.getPlayers()[data.newPlayer].getName()) {
                this.gameService.setPlayerTurn(1);
                this.touractive = 'active';
            }

        });

        this.updateScoreSub = this.gameService.updateScore().subscribe((data: any) => {
            for (let i = 0; i < this.players.length; i++) {
                let player: string = data.player;
                //if (this.players[i].equal(data.player)) {
                if (this.players[i].getName() === player) {
                    this.players[i].setScore(data.score);
                    break;
                }
            }
        });

        this.passTurnSub = this.gameService.passTurn().subscribe((data: any) => {
            this.passTurn();
        });

        this.endGameSub = this.gameService.endGame().subscribe((data: any) => {
            this.endGame();
        });

        this.annouceWinnerSub = this.gameService.announceWinner().subscribe((data: any) => {
            this.announceWinner(data.winner);
        });

        this.playerLeftSub = this.gameService.crossPlayerLeft().subscribe((data: any) => {
            this.players.forEach((player: Player) => {
                if (player.getName() === data.playerLeft) { player.setIsConnected(false); }
            });
        });

        this.disconnectionSub = this.gameService.disconnection().subscribe((data: any) => {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].getName() === data.player.name) {
                    this.players.splice(i, 1);
                }
            }
        });

    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        switch (event.keyCode) {
            case Constant.KEY_ESCAPE:
                if (this.isGameOver) {
                    this.gameService.playerLeftEndGame();
                    this.gameService.setPlayers([]);
                    this.gameService.setRoomID(-1);
                    this.gameService.disconnectSocket();
                    this.router.navigate(['/selection']);
                }
                break;
            default:
                break;
        }
    }

    passTurn(): void {
        this.gameService.changeTurn();
    }

    calculateTimeLeft(): void {
        setInterval(() => {
            this.temps++;
            if (this.touractive === 'active') {
                this.chronometreS--;
            }
            else {
                this.chronometre0 = '0';
                this.chronometreS = 0;
                this.chronometreM = 0;
            }
            if (this.chronometreS < 0) {
                this.chronometreM--;
                this.chronometreS = 59;
            }

            if (this.chronometreS < 10) {
                this.chronometre0 = '0';
            }
            else {
                this.chronometre0 = '';
            }
            if (this.chronometreS === 0 && this.chronometreM === 0 && this.touractive === 'active') {
                this.stopTime();
                this.passTurn();
                this.resetTime();
            }

        }, 1000);
    }

    resetTime(): void {
        this.chronometreM = 5;
        this.chronometreS = 0;
        this.chronometre0 = '0';
        this.temps = 0;
        this.touractive = 'active';
    }

    stopTime(): void {
        this.chronometreM = 0;
        this.chronometreS = 0;
        this.chronometre0 = '0';
        this.touractive = 'nonactive';
    }

    displayTimeLeft(): string {
        return this.chronometreM + ' : ' + this.chronometre0 + this.chronometreS;
    }

    public endGame() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].setPriority(0);             //no one can continue playing anymore
        }
        this.isGameOver = true;
    }

    public announceWinner(winner: string) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getName() === winner) {
                this.players[i].setWinner(true);
            }
        }
    }
}
