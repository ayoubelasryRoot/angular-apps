import { Component, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Letter } from './letter';
import { GameService } from './game.service';
import * as Constant from '../StaticValue/constant';

@Component({
    selector: 'rack-comp',
    templateUrl: 'assets/html/rack.html',
    styleUrls: ['assets/css/scrabble.css']
})

export class RackComponent implements OnInit {

    @Output() errorEvent = new EventEmitter();

    isActiveRack = false;
    rack: Letter[] = [];
    selectedLetter: Letter;
    letterSelected = '';
    numLetter: number[] = [0, 0, 0, 0, 0, 0, 0];
    nbOccurence: number;
    selectedOccurenceNum: number;
    nbLetter: number;
    letterInter: string;
    rackLetterPos: number;

    private sendLetterSub: Subscription;
    private changeLetterSub: Subscription;
    private addLettersSub: Subscription;
    private removeLettersSub: Subscription;
    private endGameSub: Subscription;

    public constructor(private gameService: GameService) { }

    ngOnInit() {
        this.socketHandlers();
        this.nbLetter = 7;
    }


    @HostListener('window:keyup', ['$event'])
    keyInput(event: KeyboardEvent) {
        if (this.isActiveRack === true) {
            this.manipulerrack(event.keyCode);
        }

        this.alternerActivationChevalet(event.keyCode);
    }

    @HostListener('window:beforeunload')
    leaveGame() {
        this.gameService.playerLeftGame(this.rack);
    }

    selectionnerLetterChevalet(letter: Letter): void {
        this.selectedLetter = letter;
    }

    public socketHandlers() {
        for (let i = 0; i < 7; i++) {
            this.gameService.requestLetters();
        }


        this.sendLetterSub = this.gameService.sendLetter().subscribe((data: { letter: Letter }) => {
            this.rack.push(data.letter);
        });

        this.changeLetterSub = this.gameService.changeLetters().subscribe((
            data: { letterToChange: string, newLetter: Letter }) => {
            this.changeLetter(data.letterToChange, data.newLetter);
        });

        this.removeLettersSub = this.gameService.removeLettersFromRack().subscribe((
            data: { lettersToPlace: string[] }) => {
            let lettersToPlace: Letter[] = [];
            data.lettersToPlace.forEach((element: string) => {
                if (element.charCodeAt(0) < 'a'.charCodeAt(0)) {    //verify if the character is upperCase (blank tile)
                    lettersToPlace.push(new Letter(' '));
                } else {
                    lettersToPlace.push(new Letter(element));
                }
            });

            this.updateRack(lettersToPlace, 'remove');
        });

        this.addLettersSub = this.gameService.addLettersToRack().subscribe((
            data: { lettersToRemove: Constant.LetterPosition[] }) => {
            let lettersToRemove: Letter[] = [];
            data.lettersToRemove.forEach((element: any) => {
                lettersToRemove.push(element.letter);
            });

            this.updateRack(lettersToRemove, 'add');
        });

        this.endGameSub = this.gameService.endGame().subscribe((data: string) => {
            let scoreTotal = 0;
            this.rack.forEach((letter: Letter) => {
                scoreTotal += letter.getScoreLetter();
            });
            console.log('sending end game score...');
            this.gameService.sendEndGameScore(scoreTotal, data);
        });
    }

    changeLetter(letterToChange: string, newLetter: Letter) {
        let exists = false;
        for (let indexLoop = 0; indexLoop < this.rack.length && !exists; indexLoop++) {
            if (letterToChange === '*') {
                exists = (this.rack[indexLoop].getLetter() === '');
            } else {
                exists = (this.rack[indexLoop].getLetter() === letterToChange);
            }
            if (exists) {
                this.rack[indexLoop] = newLetter;
                indexLoop = this.rack.length;
                break;
            }
        }
    }

    requestChangeLetters(letterToChange: string) {
        this.gameService.requestLettersChange(letterToChange);
    }

    initilisertableauOccurence(key: number): void {
        if (this.letterSelected !== Constant.alphabets[key - 65]) {
            this.selectedOccurenceNum = 1;
            this.letterSelected = Constant.alphabets[key - 65];
        }
    }
    remplirtableauOccurence(): void {
        this.numLetter = [0, 0, 0, 0, 0, 0, 0];
        for (let j = 0; j < this.nbLetter; j++) {
            if (this.letterSelected === this.rack[j].getLetter()) {
                this.nbOccurence++;
                this.numLetter[j] = this.nbOccurence;
            }
        }
    }

    selectionnerLetterOccurence(key: number): void {
        for (let j = 0; j < this.nbLetter; j++) {
            if (this.numLetter[j] === this.selectedOccurenceNum) {
                this.selectionnerLetterChevalet(this.rack[j]);
                //this.position = j;
                this.rackLetterPos = j;
            }
        }
        this.selectedOccurenceNum++;
        if (this.selectedOccurenceNum > this.nbOccurence) {
            this.selectedOccurenceNum = 1;
        }
        this.isExistLetter(key);
    }
    saisirLetterClavier(key: number): void {

        if (key > 64 && key < 91) {
            this.initilisertableauOccurence(key);
            this.remplirtableauOccurence();
            this.selectionnerLetterOccurence(key);
        }
    }


    deplacerLetterDroite(key: number): void {
        if (key === 39) {
            if (this.rackLetterPos < this.nbLetter - 1) {
                this.letterInter = this.rack[this.rackLetterPos].getLetter();
                this.rack[this.rackLetterPos] =
                    new Letter(this.rack[this.rackLetterPos + 1].getLetter());
                this.rack[this.rackLetterPos + 1] = new Letter(this.letterInter);
                this.rackLetterPos++;
                this.selectionnerLetterChevalet(this.rack[this.rackLetterPos]);
            }
            else {
                this.letterInter = this.rack[this.rackLetterPos].getLetter();
                for (let j = this.nbLetter - 1; j > 0; j--) {
                    this.rack[j] = new Letter(this.rack[j - 1].getLetter());
                }
                this.rack[0] = new Letter(this.letterInter);
                this.rackLetterPos = 0;
                this.selectionnerLetterChevalet(this.rack[this.rackLetterPos]);
            }
        }
    }

    deplacerLetterGauche(key: number): void {
        if (key === 37) {
            if (this.rackLetterPos > 0) {
                this.letterInter = this.rack[this.rackLetterPos].getLetter();
                this.rack[this.rackLetterPos] =
                    new Letter(this.rack[this.rackLetterPos - 1].getLetter());
                this.rack[this.rackLetterPos - 1] = new Letter(this.letterInter);
                this.rackLetterPos--;
                this.selectionnerLetterChevalet(this.rack[this.rackLetterPos]);
            }
            else {
                this.letterInter = this.rack[0].getLetter();
                for (let j = 0; j < this.nbLetter - 1; j++) {
                    this.rack[j] = new Letter(this.rack[j + 1].getLetter());
                }
                this.rack[this.nbLetter - 1] = new Letter(this.letterInter);
                this.rackLetterPos = this.nbLetter - 1;
                this.selectionnerLetterChevalet(this.rack[this.rackLetterPos]);
            }
        }
    }

    manipulerrack(key: number): void {
        this.nbOccurence = 0;
        this.saisirLetterClavier(key);
        if (this.selectedLetter.getLetter() !== '?') {
            this.deplacerLetterDroite(key);
            this.deplacerLetterGauche(key);
        }
    }

    isExistLetter(key: number): void {
        let isExist = false;
        for (let j = 0; j < this.nbLetter; j++) {
            if (Constant.alphabets[key - 65] === this.rack[j].getLetter()) {
                isExist = true;
            }
        }
        if (isExist === false) {
            this.selectedLetter = new Letter('?');
        }
    }

    alternerActivationChevalet(key: number): void {
        if (key === 9) {

            this.isActiveRack = !this.isActiveRack;


        }
    }

    public validateWord(word: string, row: string, col: number, direction: string) {
        this.gameService.validateWord(word, row, col, direction, this.rack);
    }

    updateRack(letters: Letter[], action: string) {
        if (action === 'add') {
            setTimeout(() => {
                for (let i = 0; i < letters.length; i++) {
                    this.rack.push(letters[i]);
                }
            }, Constant.RETRIEVE_DELAY * 1000);
        }
        else if (action === 'remove') {
            for (let i = 0; i < letters.length; i++) {
                for (let j = 0; j < this.rack.length; j++) {
                    //if (this.rack[j].equal(letters[i])) {
                    if (this.rack[j].getLetter() === letters[i].getLetter()) {
                        this.rack.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
}
