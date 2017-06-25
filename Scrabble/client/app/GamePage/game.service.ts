import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Player } from './player';
import { Letter } from './letter';

import * as io from 'socket.io-client';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GameService {
    private roomID: number;
    public myPlayer: Player;
    public players: Player[] = [];
    public socket: SocketIOClient.Socket;

    public connectSocket() {
        this.socket = io.connect('http://localhost:3002');

        this.socket.on('roomID', (data: any) => {
            this.roomID = data.roomID;
        });

    }

    public disconnectSocket() {
        this.socket.disconnect();
    }

    public getRoomID(): number {
        return this.roomID;
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public setPlayerTurn(priority: number): void {
        this.myPlayer.setPriority(priority);
    }

    public getMyPlayer(): Player {
        return this.myPlayer;
    }

    public setRoomID(roomID: number) {
        this.roomID = roomID;
    }

    public setMyPlayer(myPlayer: Player) {
        this.myPlayer = myPlayer;
    }

    public setPlayers(players: Player[]) {
        this.players = players;
    }

    /////////////////////////////////////////////////////////// queue
    public updateQueue(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('update_queue', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public createRoom(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('create_room', (data: any) => {
                data.roomPlayers.forEach((player: string) => {
                    if (player === this.myPlayer.getName()) {
                        let playerTemp: Player = new Player(player, 0);
                        this.players.push(playerTemp);
                        //setting client player and re-reference object
                        this.setMyPlayer(playerTemp);
                    } else {
                        //adding all room players in game service
                        this.players.push(new Player(player, 0));
                    }
                });

                this.roomID = data.roomID;

                observer.next(data);
            });
        });
        return observable;
    }

    public joinQueue(playerName: string, roomType: number) {
        this.socket.emit('join_queue', { username: playerName, roomType: roomType });
    }

    public leaveQueue(playerName: string, roomType: number) {
        this.socket.emit('leave_queue', { username: playerName, roomType: roomType });
    }

    /////////////////////////////////////////////////////////// info panel
    public updateScore(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('update_score', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public updatePriority(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('new_priority', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public passTurn(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('pass_turn', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public announceWinner(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('announce_winner', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public changeTurn() {
        this.socket.emit('change_turn', { playersSize: this.players.length, roomID: this.roomID });
    }

    public initializeData() {
        this.socket.emit('initialised', { roomID: this.roomID, playersSize: this.players.length });
    }

    public disconnection(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('delete_player', (data: any) => {
                for (let i = 0; i < this.players.length; i++) {
                    if (this.players[i].getName() === data.player._name) {
                        this.players.splice(i, 1);
                    }
                }
                observer.next(data);
            });
        });
        return observable;
    }

    public crossPlayerLeft(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('update_info_end_game', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public playerLeftEndGame() {
        this.socket.emit('player_left_end_game', { roomID: this.roomID, playerLeft: this.myPlayer.getName() });
    }

    ///////////////////////////////////////////////////////////////////////rack


    public changeTime(): Observable<{}> {

        let observable = new Observable((observer: any) => {
            this.socket.on('new_time', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public sendLetter(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('send_letter', (data: any) => {
                //when parsing the data object, the data lost all its function, so it has to be re-created
                data['letter'] = new Letter(data['letter'].name);
                observer.next(data);
            });
        });
        return observable;
    }

    public changeLetters(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('change_letters', (data: any) => {
                //when parsing the data object, the data lost all its function, so it has to be re-created
                data['newLetter'] = new Letter(data['newLetter'].name);
                observer.next(data);
            });
        });
        return observable;
    }

    public addLettersToRack(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('add_rack_letters', (data: any) => {
                //when parsing the data object, the data lost all its function, so it has to be re-created
                for (let i = 0; i < data['lettersToRemove'].length; i++) {
                    data['lettersToRemove'][i].letter = new Letter(data['lettersToRemove'][i].letter.name);
                }
                observer.next(data);
            });
        });
        return observable;
    }

    public removeLettersFromRack(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('remove_rack_letters', (data: any) => {
                //when parsing the data object, the data lost all its function, so it has to be re-created
                /*for (let i = 0; i < data['lettersToPlace'].length; i++) {
                    data['lettersToPlace'][i].letter = new Letter(data['lettersToPlace'][i].letter.name);
                }*/
                observer.next(data);
            });
        });
        return observable;
    }

    public endGame(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('end_game', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public sendEndGameScore(score: number, activePlayer: string) {
        this.socket.emit('send_end_game_score',
            { roomID: this.roomID, senderPlayer: this.myPlayer.getName(), activePlayer: activePlayer, score: score });
    }

    public requestLetters() {
        this.socket.emit('request_letter', { roomID: this.roomID });
    }

    public requestLettersChange(letterToChange: string) {
        this.socket.emit('request_letters_change', { letter: letterToChange, roomID: this.roomID });
    }

    public playerLeftGame(rack: Letter[]) {
        this.socket.emit('player_left', { player: this.myPlayer, letters: rack, roomID: this.roomID });
    }
    //////////////////////////////////////////////////////////////////////////////Reserve

    public updateReserve(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('update_reserve', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }
    //////////////////////////////////////////////////////////////////////////////Grid

    public placeWordInGrid(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('place_word_in_grid', (data: any) => {
                //when parsing the data object, the data lost all its function, so it has to be re-created
                for (let i = 0; i < data['lettersToPlace'].length; i++) {
                    let letter: Letter = new Letter(data['lettersToPlace'][i].letter.name);
                    letter.setScoreLetter(data['lettersToPlace'][i].letter.score);
                    data['lettersToPlace'][i].letter = letter;
                }
                observer.next(data);
            });
        });
        return observable;
    }

    public retrieveWordFromGrid(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('retrieve_word_in_grid', (data: any) => {
                //when parsing the data object, the data lost all its function, so it has to be re-created
                for (let i = 0; i < data['lettersToRemove'].length; i++) {
                    data['lettersToRemove'][i].letter = new Letter(data['lettersToRemove'][i].letter.name);
                }
                observer.next(data);
            });
        });
        return observable;
    }
    /////////////////////////////////////////////////////////////////////////////////Chat

    public insertMessage(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('new_message', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public displayError(): Observable<{}> {
        let observable = new Observable((observer: any) => {
            this.socket.on('display_error', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    public connectToChat(player: string) {
        // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
        this.socket.emit('connection', player);
    }

    public leaveChat() {
        let message: String = this.myPlayer.getName() + " has left the game";
        let temp = { username: "Game Service", text: message, roomID: this.roomID };
        this.socket.emit('send_message', temp);
    }

    public sendMessage(message: any) {
        let temp = { username: this.myPlayer.getName(), text: message, roomID: this.roomID };
        this.socket.emit('send_message', temp);
    }

    public validateWord(word: string, row: string, col: number, direction: string, rack: Letter[]) {
        this.socket.emit('word_validation',
            {
                word: word, row: row, col: col, direction: direction,
                player: this.myPlayer.getName(), roomID: this.roomID, rack: rack
            });
    }
    ////////////////////////////////////////////////////////////////////////////////////Game Component

    public initGameData() {
        this.socket.emit('init_game_data', { roomID: this.roomID });
    }

}
