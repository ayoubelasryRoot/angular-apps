import { Component, Output, HostListener, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { LoginService } from '../login/login.service';
import { GameService } from './game.service';
import * as Constant from '../StaticValue/constant';

@Component({
    selector: 'chat-comp',
    templateUrl: 'assets/html/chat.html',
    styleUrls: ['assets/css/scrabble.css']
})

export class ChatComponent implements OnInit {
    @Output() changeLettersEvent = new EventEmitter();
    @Output() changeTurnsEvent = new EventEmitter();
    @Output() wordValidationEvent = new EventEmitter();

    messages: String[] = [];
    isHelpMenuOpen = false;

    private messageEnvoye: { username: String, text: String, type: String }[] = [];
    private username: string;

    private newMessageSub: Subscription;
    private errorSub: Subscription;

    constructor(private loginServ: LoginService, private gameService: GameService) { }

    ngOnInit() {
        this.username = this.loginServ.getName();

        // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
        //this.gameService.socket.emit('connection', this.username);
        this.gameService.connectToChat(this.username);

        // Quand on reçoit un message, on l'insère dans la page
        this.newMessageSub = this.gameService.insertMessage().subscribe((data: any) => {
            let temp = { username: data.username, text: data.message, type: 'normal' };
            this.insertMessage(temp);
        });

        // Quand un nouveau client se connecte, on affiche l'information
        this.errorSub = this.gameService.displayError().subscribe((data: any) => {
            let errorCode = data.errorCode;
            this.displayErrorMessage(errorCode);
        });
    }

    @HostListener('window:beforeunload')
    leaveGame() {
        this.gameService.leaveChat();
        this.changeTurnsEvent.emit();
    }

    insertMessage(message: any) {
        this.messageEnvoye.push(message);
    }

    sendMessage(message: any) {
        this.gameService.sendMessage(message);
    }

    displayErrorMessage(code: number) {
        let message: string;

        switch (code) {
            case Constant.ErrorCode.BORDER_ERROR:
                message = "Erreur de syntaxe";
                break;

            case Constant.ErrorCode.CONFLICT_ERROR:
            case Constant.ErrorCode.RACK_ERROR:
            case Constant.ErrorCode.EXIST_ERROR:
            case Constant.ErrorCode.RULE_ERROR:
                message = "Commande impossible à réaliser";
                break;

            case Constant.ErrorCode.OTHER_ERROR:
                message = "Entrée Invalide";
                break;
            case Constant.ErrorCode.TURN_ERROR:
                message = "Ce n'est pas votre tour";
                break;
        }
        let data: any = { username: '', text: message, type: 'error' };
        this.insertMessage(data);
    }

    onEnter(message: string) {

        if (message[0] === '!') {
            let splitText: string[] = ['', '', ''];
            splitText = message.split(' ');
            let command = splitText[0];
            let param1 = splitText[1];
            let param2 = splitText[2];

            if (message === "!aide") {
                this.isHelpMenuOpen = true;
            }
            else if (message === "!quitter") {
                this.isHelpMenuOpen = false;
            }
            else if (message === "!passer") {
                if (this.gameService.getMyPlayer().getPriority() === 1) {
                    this.changeTurnsEvent.emit();
                } else {
                    this.displayErrorMessage(Constant.ErrorCode.TURN_ERROR);            //not player's turn
                }
            }
            else if (command === "!placer") {
                if (this.gameService.getMyPlayer().getPriority() === 1) {
                    let row: string = param1[0];
                    let col: number = Number(param1.substr(1, param1.length - 2));
                    let direction: string = param1.slice(-1);
                    this.wordValidationEvent.emit({ word: param2, row: row, col: col, direction: direction });
                } else {
                    this.displayErrorMessage(Constant.ErrorCode.TURN_ERROR);            //not player's turn
                }
            } else if (message.includes("!changer")) {
                if (this.gameService.getMyPlayer().getPriority() === 1) {
                    for (let i = 9; i < message.length; i++) {
                        this.changeLettersEvent.emit({ letter: message[i] });
                    }
                    this.changeTurnsEvent.emit();
                } else { this.displayErrorMessage(Constant.ErrorCode.TURN_ERROR); }     //not player's turn
            } else {
                this.displayErrorMessage(Constant.ErrorCode.OTHER_ERROR);
            }
        } else {
            this.messages.push(message);
            this.sendMessage(message);
        }
        (<HTMLInputElement>document.getElementById("commande")).value = "";     //empty the text input field

    }

}
