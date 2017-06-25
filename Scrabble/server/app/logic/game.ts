import { Application } from '../app';
import { Reserve } from '../Reserve/reserve';
import { Grid } from '../logic/grid';
import { Letter } from '../logic/letter';
import * as Constant from '../StaticValues/constant';
import { ScoreCalculator } from '../ScoreCalculator/ScoreCalculator';
import { SocketManager } from './socketManager';

interface Room {
    members: string[];
    roomSize: number;
    ID: number;
}

interface Player {
    name: string;
    score: number;
}

interface Timer {
    chronometreM: number;
    chronometreS: number;
}

interface GameSpecifics {
    reserve: Reserve;
    priority: number;
    timer: Timer;

}

export class Game {
    private socketManager: SocketManager;
    private scoreCalculator: ScoreCalculator;
    private roomGrids: Grid[];
    private roomPlayers: Player[][];
    private roomGame: GameSpecifics[] = [];
    private queues: Room[] = [];

    private roomIDCount = 10;

    constructor() {
        this.scoreCalculator = new ScoreCalculator();
        this.roomGrids = [];
        this.roomPlayers = [];
        this.initRooms();
        this.socketManager = SocketManager.getInstance();
    }

    public getQueueRoom(roomType: number): Room {
        return this.queues[roomType];
    }

    public getRoomPlayers(roomID: number): Player[] {
        return this.roomPlayers[roomID];
    }

    public getCurrentRoomID(): number {
        return this.roomIDCount;
    }

    public initRooms() {
        for (let i = 0; i < 5; i++) {
            this.queues.push({ members: [], roomSize: i, ID: i });
        }

        for (let i = 0; i < 10; i++) {
            this.roomGame.push(null);
        }
    }

    public createRoom(roomMembers: string[], roomType: number, roomID: number): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            Application.database.addGameRoom(roomMembers, roomType, roomID)
                .then((res: any) => {
                    resolve(res);
                });
        });
    }

    public joinQueue(roomType: number, newMember: string) {
        let queue: Room = this.queues[roomType];

        queue.members.push(newMember);

        if (!this.roomHasSpaceLeft(queue, roomType)) {
            this.socketManager.switchRoom(roomType, this.roomIDCount);
            let members: string[] = queue.members.slice(0);

            this.roomPlayers[this.roomIDCount] = [];
            members.forEach((member) => {
                this.roomPlayers[this.roomIDCount].push({ name: member, score: 0 });
            });

            this.createRoom(members, queue.roomSize, this.roomIDCount)      //create room in database
                .then((res: any) => {
                    this.socketManager.createRoom(this.roomIDCount, members);
                    this.resetQueue(roomType);
                    this.roomIDCount++;
                });

            this.createRoomData();
            this.socketManager.assignRoomID(this.roomIDCount);
        }

        this.socketManager.updateQueue(roomType, queue);
    }

    public createRoomData() {
        this.roomGame.push({
            reserve: new Reserve(), priority: 0,
            timer: { chronometreM: 5, chronometreS: 0 }
        });
    }

    public getRoomReserve(roomID: number): Reserve {
        return this.roomGame[roomID].reserve;
    }

    public leaveQueue(roomType: number, memberLeft: string) {
        let queue: Room = this.queues[roomType];
        //remove player who cancelled queue
        let index = queue.members.indexOf(memberLeft);
        if (index > -1) {
            queue.members.splice(index, 1);
        }

        this.socketManager.updateQueue(roomType, queue);
    }

    resetQueue(roomType: number) {
        this.queues[roomType].members.length = 0;       //empty the current room of the specified type
    }

    roomHasSpaceLeft(room: Room, roomType: number): boolean {
        return room.members.length < roomType;
    }

    private isWordInRack(lettersUsed: string[], rack: Letter[]): boolean {
        let isInRack = true;
        for (let i = 0; i < lettersUsed.length && isInRack; i++) {
            let isFound = false;
            for (let j = 0; j < rack.length && !isFound; j++) {
                //verify if the character is upperCase (blank tile)
                if (lettersUsed[i].charCodeAt(0) < 'a'.charCodeAt(0)) {
                    if (rack[j].getLetter() === ' ') {
                        isFound = true;
                    }
                } else {
                    if (rack[j].getLetter() === lettersUsed[i]) {
                        isFound = true;
                    }
                }
            }
            if (!isFound) { isInRack = isFound; }
        }

        return isInRack;
    }

    public resetTimer(roomID: number) {
        this.roomGame[roomID].timer.chronometreM = 5;
        this.roomGame[roomID].timer.chronometreS = 0;
    }

    public changeTime(roomID: number, playersSize: number) {

        setInterval(() => {
            if (this.roomGame[roomID].timer.chronometreS === 0) {
                if (this.roomGame[roomID].timer.chronometreM === 0) {
                    this.roomGame[roomID].priority++;
                    this.roomGame[roomID].priority = this.roomGame[roomID].priority % playersSize;
                    this.resetTimer(roomID);
                    this.socketManager.updatePriority(roomID, this.roomGame[roomID].priority);
                }
                this.roomGame[roomID].timer.chronometreM--;
                this.roomGame[roomID].timer.chronometreS += (playersSize - 1);
                this.roomGame[roomID].timer.chronometreS = 59;
            } else {
                this.roomGame[roomID].timer.chronometreS--;
            }

            this.socketManager.updateTime(roomID,
                this.roomGame[roomID].timer.chronometreM, this.roomGame[roomID].timer.chronometreS);

        }, 1000);
    }

    public sendLetter(socket: SocketIO.Socket, nbLetters: number, roomID: number): boolean {
        let isSendSuccessful = true;
        let numberOfLettersToSend = nbLetters;

        for (let i = 0; i < numberOfLettersToSend; i++) {
            if (this.roomGame[roomID].reserve.remainingLetters > 0) {
                this.socketManager.sendLetterToClient(socket, this.roomGame[roomID].reserve.randomLetterGenerator());
                this.socketManager.updateReserve(roomID, this.roomGame[roomID].reserve.remainingLetters);
            } else {
                isSendSuccessful = false;
                break;
            }
        }
        return isSendSuccessful;
    }

    private getPlayer(roomID: number, name: string): Player {
        let roomPlayers: Player[] = this.roomPlayers[roomID];
        for (let i = 0; i < roomPlayers.length; i++) {
            if (roomPlayers[i].name === name) { return roomPlayers[i]; }
        }
        return null;
    }

    private determineWinner(roomID: number): Player {
        let highScore = 0;
        let winner: Player;
        for (let i = 0; i < this.roomPlayers[roomID].length; i++) {
            if (this.roomPlayers[roomID][i].score > highScore) {
                highScore = this.roomPlayers[roomID][i].score;
                winner = this.roomPlayers[roomID][i];
            }
        }
        return winner;
    }

    public changeTurn(roomID: number, nbPlayer: number) {
        this.roomGame[roomID].priority++;
        this.roomGame[roomID].priority = this.roomGame[roomID].priority % nbPlayer;
        this.socketManager.updatePriority(roomID, this.roomGame[roomID].priority);
        this.resetTimer(roomID);
    }

    public playerLeft(roomID: number, letters: Letter[]) {
        for (let i = 0; i < letters.length; i++) {
            for (let j = this.roomGame[roomID].reserve.usedLettersPosition;
                j < this.roomGame[roomID].reserve.letters.length; j++) {
                if (this.roomGame[roomID].reserve.letters[j].getLetter()
                    === letters[i].getLetter()) {
                    let temp =
                        this.roomGame[roomID].reserve.letters[
                        this.roomGame[roomID].reserve.usedLettersPosition];
                    this.roomGame[roomID].reserve.letters[
                        this.roomGame[roomID].reserve.usedLettersPosition] =
                        this.roomGame[roomID].reserve.letters[j];
                    this.roomGame[roomID].reserve.letters[j] = temp;
                    this.roomGame[roomID].reserve.usedLettersPosition++;
                    this.roomGame[roomID].reserve.remainingLetters++;
                    j = this.roomGame[roomID].reserve.letters.length;
                }
            }
        }
        this.socketManager.updateReserve(roomID, this.roomGame[roomID].reserve.remainingLetters);
    }

    public requestLetter(roomID: number, socket: SocketIO.Socket) {
        if (roomID !== undefined && this.roomGame[roomID].reserve.remainingLetters > 1) {
            this.socketManager.sendLetterToClient(socket, this.roomGame[roomID].reserve.randomLetterGenerator());
            this.socketManager.updateReserve(roomID, this.roomGame[roomID].reserve.remainingLetters);
        }
    }

    public requestLetterChange(roomID: number, letter: string, socket: SocketIO.Socket) {
        let letterToSearch: string;
        if (letter === '*') { letterToSearch = ' '; }              //if it's a blank letter
        else { letterToSearch = letter; }
        if (this.roomGame[roomID].reserve.remainingLetters > 0) {
            for (let i = this.roomGame[roomID].reserve.usedLettersPosition;
                i < this.roomGame[roomID].reserve.letters.length; i++) {
                if (letterToSearch === this.roomGame[roomID].reserve.letters[i].getLetter()) {
                    let temp = this.roomGame[roomID].reserve.letters[i];
                    this.roomGame[roomID].reserve.letters[i] =
                        this.roomGame[roomID].reserve.letters[
                        this.roomGame[roomID].reserve.usedLettersPosition];
                    this.roomGame[roomID].reserve.letters[
                        this.roomGame[roomID].reserve.usedLettersPosition] = temp;
                    this.roomGame[roomID].reserve.remainingLetters++;
                    //puisque on va reutiliser randomLetterGenerator et que le nombre de lettre reste le meme
                    this.roomGame[roomID].reserve.usedLettersPosition++;
                    i = this.roomGame[roomID].reserve.letters.length;
                    this.socketManager.changeLetterForClient(socket, letterToSearch,
                        this.roomGame[roomID].reserve.randomLetterGenerator());
                }
            }
        }
    }

    public initGameData(roomID: number) {
        console.log('initializing grid and reserve...');
        //create grid for newly created room
        if (this.roomGrids[roomID] !== null) { this.roomGrids[roomID] = new Grid(); }
    }

    public sendEndGameScore(roomID: number, activePlayerName: string, senderPlayerName: string, score: number) {
        let activePlayer: Player = this.getPlayer(roomID, activePlayerName);
        let senderPlayer: Player = this.getPlayer(roomID, senderPlayerName);

        activePlayer.score += score;
        senderPlayer.score -= score;

        this.socketManager.updateScore(roomID, activePlayerName, activePlayer.score);
        this.socketManager.updateScore(roomID, senderPlayerName, senderPlayer.score);
        this.socketManager.announceWinner(roomID, this.determineWinner(roomID).name);
    }

    public validateWord(word: string, rowInput: string, colInput: number, direction: string,
        player: string, rack: Letter[], roomID: number, socket: SocketIO.Socket) {
        let row: number = rowInput.charCodeAt(0) - 'a'.charCodeAt(0);        //convert alphabet row to number row
        let col: number = colInput - 1;
        let errorCode: number = Constant.ErrorCode.NO_ERROR;

        let currentGrid: Grid = this.roomGrids[roomID];

        currentGrid.setWordForValidation(word, row, col, direction);

        errorCode = currentGrid.validateOverFlow();

        if (errorCode === Constant.ErrorCode.NO_ERROR) {
            errorCode = currentGrid.isConflicted();

            if (errorCode === Constant.ErrorCode.NO_ERROR) {
                if (!this.isWordInRack(currentGrid.getLettersStringUsed(), rack)) {
                    errorCode = Constant.ErrorCode.RACK_ERROR;
                    console.log('word not in rack');
                }

                if (errorCode === Constant.ErrorCode.NO_ERROR) {
                    currentGrid.placeNewWord();
                    this.socketManager.placeWordInGrid(roomID, currentGrid.getLettersUsed());
                    this.socketManager.removeRackLettersOfClient(socket, currentGrid.getLettersStringUsed());


                    errorCode = currentGrid.isFirstOperationCleared();
                    if (errorCode !== Constant.ErrorCode.NO_ERROR) {
                        currentGrid.retrieveNewWord();
                        this.socketManager.retrieveWordInGrid(roomID, currentGrid.getLettersUsed());
                        this.socketManager.addRackLettersOfClient(socket, currentGrid.getLettersUsed());
                    }
                }
            }
        }

        if (errorCode === Constant.ErrorCode.NO_ERROR) {
            console.log('validating dictionary... ');

            //real word consist of adding top and bottom letter of the actual word
            let realWord: string = currentGrid.checkRealWord();

            Application.database.validateWord(realWord)
                .then((res: any) => {
                    let scoreTotal = 0;

                    if (res === false) {
                        console.log('word does not exist');
                        errorCode = Constant.ErrorCode.EXIST_ERROR;
                        currentGrid.retrieveNewWord();
                        this.socketManager.retrieveWordInGrid(roomID, currentGrid.getLettersUsed());
                        //update grid with removed word to all client
                        this.socketManager.addRackLettersOfClient(socket, currentGrid.getLettersUsed());
                    } else {
                        let scores: number[] = [];
                        for (let i = 0; i < realWord.length; i++) {
                            if (realWord[i].charCodeAt(0) < 'a'.charCodeAt(0)) {
                                scores.push(new Letter(' ').getScoreLetter());
                            }
                            else { scores.push(new Letter(realWord[i]).getScoreLetter()); }
                        }

                        this.scoreCalculator.setWordData(row, col, scores, direction);
                        scoreTotal += this.scoreCalculator.getScoreWord();
                    }

                    if (errorCode === Constant.ErrorCode.NO_ERROR) {
                        console.log('validating adjacent words... ');
                        let adjacentWords: { word: string, row: number, col: number }[] =
                            currentGrid.checkAdjacentWords();

                        errorCode = currentGrid.isWordConnected();
                        if (errorCode === Constant.ErrorCode.NO_ERROR) {

                            if (adjacentWords.length !== 0) {
                                new Promise<boolean>((resolve) => {
                                    let isWordValid = true;
                                    let wordCount = 0;
                                    for (let i = 0; i < adjacentWords.length && isWordValid; i++) {
                                        Application.database.validateWord(adjacentWords[i].word)
                                            .then((res: any) => {
                                                wordCount++;
                                                isWordValid = res;
                                                if (wordCount === adjacentWords.length || !isWordValid) {
                                                    resolve(isWordValid);
                                                }
                                            });
                                    }
                                })
                                    .then((resp: any) => {
                                        if (resp === false) {
                                            console.log('one of adjacent words does not exist');
                                            errorCode = Constant.ErrorCode.EXIST_ERROR;
                                            currentGrid.retrieveNewWord();

                                            this.socketManager.retrieveWordInGrid(roomID, currentGrid.getLettersUsed());
                                            this.socketManager.addRackLettersOfClient(
                                                socket, currentGrid.getLettersUsed());
                                        } else {
                                            currentGrid.setIsFirstTurn(false);
                                            if (!this.sendLetter(socket, currentGrid.getLettersUsed().length, roomID)) {
                                                this.socketManager.endGame(socket, roomID, player);
                                            }

                                            for (let i = 0; i < adjacentWords.length; i++) {
                                                let scores: number[] = [];
                                                let wordTemp: string = adjacentWords[i].word;
                                                for (let j = 0; j < wordTemp.length; j++) {
                                                    scores.push(new Letter(wordTemp[j]).getScoreLetter());
                                                }

                                                this.scoreCalculator.setWordData(
                                                    adjacentWords[i].row, adjacentWords[i].col, scores, direction);
                                                scoreTotal += this.scoreCalculator.getScoreWord();
                                            }

                                            let currentPlayer: Player = this.getPlayer(roomID, player);
                                            currentPlayer.score += scoreTotal;
                                            this.socketManager.updateScore(roomID, player, currentPlayer.score);

                                            this.socketManager.passTurn(socket);
                                        }

                                        this.socketManager.displayError(socket, errorCode);
                                    });
                            } else {
                                currentGrid.setIsFirstTurn(false);
                                if (!this.sendLetter(socket, currentGrid.getLettersUsed().length, roomID)) {
                                    this.socketManager.endGame(socket, roomID, player);
                                }

                                let currentPlayer: Player = this.getPlayer(roomID, player);
                                currentPlayer.score += scoreTotal;
                                this.socketManager.updateScore(roomID, player, currentPlayer.score);
                                this.socketManager.passTurn(socket);
                            }
                        } else {
                            console.log('word is not connected');
                            currentGrid.retrieveNewWord();
                            this.socketManager.retrieveWordInGrid(roomID, currentGrid.getLettersUsed());
                            this.socketManager.addRackLettersOfClient(socket, currentGrid.getLettersUsed());
                        }

                        if (errorCode !== Constant.ErrorCode.NO_ERROR) {
                            //display error in local client
                            this.socketManager.displayError(socket, errorCode);
                        }
                    }
                });
        } else {
            if (errorCode !== Constant.ErrorCode.NO_ERROR) {
                this.socketManager.displayError(socket, errorCode); //display error in local client
            }
        }
    }
}
