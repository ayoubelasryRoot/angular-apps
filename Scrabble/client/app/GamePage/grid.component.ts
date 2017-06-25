import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { GameService } from './game.service';
import { Letter } from './letter';
import * as Constant from '../StaticValue/constant';


@Component({
    selector: 'grid-comp',
    templateUrl: 'assets/html/grid.html',
    styleUrls: ['assets/css/scrabble.css']
})



export class GridComponent implements OnInit {
    board: number[][] = [];
    matrixLetter: Letter[][] = [];

    header: string[] = [];
    id: string[][] = [];

    private placeWordSub: Subscription;
    private retrieveWordSub: Subscription;

    constructor(private gameService: GameService) { }

    ngOnInit() {
        this.initGrids();
        this.initialiserID();
        this.header = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O'];

        this.placeWordSub = this.gameService.placeWordInGrid().subscribe((
            data: { lettersToPlace: Constant.LetterPosition[] }) => {
            this.placeNewWord(data.lettersToPlace);
        });

        this.retrieveWordSub = this.gameService.retrieveWordFromGrid().subscribe((
            data: { lettersToRemove: Constant.LetterPosition[] }) => {
            this.retrieveNewWord(data.lettersToRemove);
        });
    }

    initGrids(): void {
        for (let i = 0; i < Constant.BOARD.length; i++) {
            this.board[i] = Constant.BOARD[i].slice();
        }

        for (let i = 0; i < Constant.GRID_ROW_LENGTH; i++) {
            let tempRow: Letter[] = [];
            for (let j = 0; j < Constant.GRID_COL_LENGTH; j++) {
                tempRow.push(null);
            }
            this.matrixLetter.push(tempRow);
        }
    }

    initialiserID() {
        for (let i = 0; i < Constant.GRID_ROW_LENGTH; i++) {
            let temp: string[] = [];
            for (let j = 0; j < Constant.GRID_COL_LENGTH; j++) {
                let position: string = "" + i + "" + j;
                temp.push(position);
            }
            this.id.push(temp);
        }
    }

    placeNewWord(lettersUsed: Constant.LetterPosition[]) {
        for (let i = 0; i < lettersUsed.length; i++) {
            this.matrixLetter[lettersUsed[i].row][lettersUsed[i].col] = lettersUsed[i].letter;
            this.board[lettersUsed[i].row][lettersUsed[i].col] = Constant.TILE;
        }
    }

    retrieveNewWord(lettersToRemove: Constant.LetterPosition[]) {
        setTimeout(() => {
            for (let i = 0; i < lettersToRemove.length; i++) {
                //remove the letters previously placed
                this.matrixLetter[lettersToRemove[i].row][lettersToRemove[i].col] = null;
                this.board[lettersToRemove[i].row][lettersToRemove[i].col] =
                    Constant.BOARD[lettersToRemove[i].row][lettersToRemove[i].col];
            }
        }, Constant.RETRIEVE_DELAY * 1000);
    }
}
