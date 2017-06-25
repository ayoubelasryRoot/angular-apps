import { Letter } from './letter';
import * as Constant from '../StaticValues/constant';


export class Grid {
    private matrixGrid: Letter[][];
    private word: string;
    private row: number;
    private col: number;
    private direction: string;
    private isConnected: boolean;   //word is connected with words in grid
    private isFirstTurn: boolean;
    private lettersUsed: Constant.LetterPosition[];
    private lettersStringUsed: string[];

    constructor() {
        this.matrixGrid = [];
        this.lettersUsed = [];
        this.lettersStringUsed = [];
        this.isFirstTurn = true;
        this.initGrid();
    }

    private initGrid(): void {
        for (let i = 0; i < Constant.GRID_ROW_LENGTH; i++) {
            let tempRow: Letter[] = [];
            for (let j = 0; j < Constant.GRID_COL_LENGTH; j++) {
                tempRow.push(null);
            }
            this.matrixGrid.push(tempRow);
        }
    }

    public setWordForValidation(word: string, row: number, col: number, direction: string) {
        this.word = word;
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.isConnected = false;
        this.lettersUsed.length = 0;
        this.lettersStringUsed.length = 0;
    }

    public validateOverFlow(): Constant.ErrorCode {
        console.log('validating overflow... ');

        if (this.direction === 'h') {           //horizontal
            if (this.isOverFlowHorizontal()) { return Constant.ErrorCode.BORDER_ERROR; }

        }
        else if (this.direction === 'v') {      //vertical
            if (this.isOverFlowVertical()) { return Constant.ErrorCode.BORDER_ERROR; }
        }

        return Constant.ErrorCode.NO_ERROR;
    }

    public isConflicted() {
        console.log('validating word conflict... ');
        if (this.direction === 'h') {           //horizontal
            if (this.isConflictedWithVerticalWord()) { return Constant.ErrorCode.CONFLICT_ERROR; }

        }
        else if (this.direction === 'v') {      //vertical
            if (this.isConflictedWithHorizontalWord()) { return Constant.ErrorCode.CONFLICT_ERROR; }
        }

        return Constant.ErrorCode.NO_ERROR;
    }

    public isFirstOperationCleared(): Constant.ErrorCode {
        console.log('validating first operation... ');
        if (this.matrixGrid[7][7] === null) {
            return Constant.ErrorCode.RULE_ERROR;
        }
        return Constant.ErrorCode.NO_ERROR;
    }

    public isOverFlowHorizontal(): boolean {
        if ((this.row < 0 || this.row >= Constant.GRID_ROW_LENGTH) ||
            (this.col < 0 || this.col >= Constant.GRID_COL_LENGTH) ||
            this.col + this.word.length > Constant.GRID_ROW_LENGTH) {
            console.log('failed border test');
            return true;  //creation of word has failed
        }
        else { return false; }
    }

    public isOverFlowVertical(): boolean {
        if ((this.row < 0 || this.row >= Constant.GRID_ROW_LENGTH) ||
            (this.col < 0 || this.col >= Constant.GRID_COL_LENGTH) ||
            this.row + this.word.length > Constant.GRID_COL_LENGTH) {
            console.log('failed border test');
            return true;  //creation of word has failed
        }
        else { return false; }
    }

    public isConflictedWithVerticalWord(): boolean {
        //Verify collision with another word
        let pos = 0;        //position of grid to verify
        for (let i = pos; i < this.word.length; i++) {
            if (this.matrixGrid[this.row][this.col + pos] !== null) {
                //skip the position until the next free space
                if (this.matrixGrid[this.row][this.col + pos].getLetter() === this.word[i]) {
                    this.isConnected = true;
                    pos++;
                } else {
                    console.log('conflict with existing letter');
                    return true;
                }
            } else {
                let letter: Letter = new Letter(this.word.charAt(i).toLowerCase());
                //change score for 0 if character is uppercase (blank tile)
                if (this.word.charAt(i).charCodeAt(0) < 'a'.charCodeAt(0)) { letter.setScoreLetter(0); }
                this.lettersUsed.push({ letter: letter, row: this.row, col: this.col + pos });
                this.lettersStringUsed.push(this.word.charAt(i));
                pos++;
            }
        }

        return false;
    }

    public isConflictedWithHorizontalWord(): boolean {
        //Verify collision with another word
        let pos = 0;        //position of grid to verify
        for (let i = pos; i < this.word.length; i++) {
            if (this.matrixGrid[this.row + pos][this.col] !== null) {
                //skip the position until the next free space
                if (this.matrixGrid[this.row + pos][this.col].getLetter() === this.word[i]) {
                    this.isConnected = true;
                    pos++;
                } else {
                    console.log('conflict with existing letter');
                    return true;
                }
            } else {
                let letter: Letter = new Letter(this.word.charAt(i).toLowerCase());
                //change score for 0 if character is uppercase (blank tile)
                if (this.word.charAt(i).charCodeAt(0) < 'a'.charCodeAt(0)) { letter.setScoreLetter(0); }
                this.lettersUsed.push({ letter: letter, row: this.row + pos, col: this.col });
                this.lettersStringUsed.push(this.word.charAt(i));
                pos++;
            }
        }

        return false;
    }

    public placeNewWord() {
        console.log('placing word... ');
        for (let i = 0; i < this.lettersUsed.length; i++) {
            this.matrixGrid[this.lettersUsed[i].row][this.lettersUsed[i].col] = this.lettersUsed[i].letter;
        }
    }

    public retrieveNewWord() {
        console.log('retrieving word... ');
        for (let i = 0; i < this.lettersUsed.length; i++) {
            //remove the letters previously placed
            this.matrixGrid[this.lettersUsed[i].row][this.lettersUsed[i].col] = null;
        }
    }

    public checkAdjacentWords(): { word: string, row: number, col: number }[] {
        if (this.direction === 'h') {           //horizontal
            return this.checkAdjacentVerticalWords();
        }
        else if (this.direction === 'v') {      //vertical
            return this.checkAdjacentHorizontalWords();
        }
    }

    public checkAdjacentHorizontalWords(): { word: string, row: number, col: number }[] {
        let adjacentWords: { word: string, row: number, col: number }[] = [];

        for (let i = 0; i < this.lettersUsed.length; i++) {
            //check for presence of adjacent word starting from the left position of main word
            if ((this.col - 1 >= 0 && this.col + 1 <= Constant.GRID_ROW_LENGTH) &&
                this.matrixGrid[this.row + i][this.col - 1] !== null ||
                this.matrixGrid[this.row + i][this.col + 1] !== null) {
                this.isConnected = true;
                let offset = -1;
                while (this.matrixGrid[this.row + i][this.col + offset] !== null) {
                    //search for the starting position of adjacent word
                    offset--;
                }
                offset++;

                let word = '';
                let row: number = this.row + i;
                let col: number = this.col + offset;

                while (this.matrixGrid[this.row + i][this.col + offset] !== null) {
                    //construction of adjacent word
                    word += this.matrixGrid[this.row + i][this.col + offset].getLetter();
                    offset++;
                }

                adjacentWords.push({ word: word, row: row, col: col });
            }
        }

        return adjacentWords;
    }

    public checkAdjacentVerticalWords(): { word: string, row: number, col: number }[] {
        let adjacentWords: { word: string, row: number, col: number }[] = [];

        for (let i = 0; i < this.lettersUsed.length; i++) {
            //check for presence of adjacent word starting from the top position of main word
            if ((this.row - 1 >= 0 && this.row + 1 <= Constant.GRID_COL_LENGTH) &&
                this.matrixGrid[this.row - 1][this.col + i] !== null ||
                this.matrixGrid[this.row + 1][this.col + i] !== null) {
                this.isConnected = true;
                let offset = -1;
                while (this.matrixGrid[this.row + offset][this.col + i] !== null) {
                    //search for the starting position of adjacent word
                    offset--;
                }
                offset++;

                let word = '';
                let row: number = this.row + offset;
                let col: number = this.col + i;

                while (this.matrixGrid[this.row + offset][this.col + i] !== null) {
                    //construction of adjacent word
                    word += this.matrixGrid[this.row + offset][this.col + i].getLetter();
                    offset++;
                }

                adjacentWords.push({ word: word, row: row, col: col });
            }
        }

        return adjacentWords;
    }

    public checkRealWord(): string {
        console.log('checking real word... ');
        let realWord: string;
        if (this.direction === 'h') {           //horizontal
            realWord = this.checkRealHorizontalWord();
        }
        else if (this.direction === 'v') {      //vertical
            realWord = this.checkRealVerticalWord();
        }

        if (realWord !== this.word) { this.isConnected = true; }
        return realWord;
    }

    public checkRealHorizontalWord(): string {
        let realWord: string = this.word;
        let offset = -1;
        //add letter on word prefix
        while (this.matrixGrid[this.row][this.col + offset] !== null) {
            realWord = this.matrixGrid[this.row][this.col + offset].getLetter() + realWord;
            offset--;
        }

        offset = 0;
        //add letter on word suffix
        while (this.matrixGrid[this.row][this.col + this.word.length + offset] !== null) {
            realWord = realWord + this.matrixGrid[this.row][this.col + this.word.length + offset].getLetter();
            offset++;
        }

        return realWord;
    }

    public checkRealVerticalWord(): string {
        let realWord: string = this.word;
        let offset = -1;
        //add letter on word prefix
        while (this.matrixGrid[this.row + offset][this.col] !== null) {
            realWord = this.matrixGrid[this.row + offset][this.col].getLetter() + realWord;
            offset--;
        }

        offset = 0;
        //add letter on word suffix
        while (this.matrixGrid[this.row + this.word.length + offset][this.col] !== null) {
            realWord = realWord + this.matrixGrid[this.row + this.word.length + offset][this.col].getLetter();
            offset++;
        }

        return realWord;
    }

    public isWordConnected(): Constant.ErrorCode {
        if (this.isConnected || this.isFirstTurn) { return Constant.ErrorCode.NO_ERROR; }
        return Constant.ErrorCode.RULE_ERROR;
    }

    public setIsFirstTurn(isFirstTurnCompleted: boolean) {
        this.isFirstTurn = isFirstTurnCompleted;
    }

    public getLettersUsed(): Constant.LetterPosition[] {
        return this.lettersUsed;
    }

    public getLettersStringUsed(): string[] {
        return this.lettersStringUsed;
    }

    public putLetter(letter: Letter, row: number, col: number) {
        this.matrixGrid[row][col] = letter;
    }

    public setLettersUsed(lettersUsed: Constant.LetterPosition[]) {
        this.lettersUsed = lettersUsed;
    }
}
