import { Component, HostListener } from '@angular/core';
import { MdDialog } from '@angular/material';
import { SudokuService } from '../services/sudoku.service';
import { TimerService } from '../services/timer.service';
import { SudokuLogiqueFonctions } from '../logique_operations/SudokuLogiqueFonctions';
import { LoginService } from '../services/login.service';
import { LeaderboardComponent } from './leaderboard.component';

enum Direction {
    RIGHT = 39,
    LEFT = 37,
    UP = 38,
    DOWN = 40
}

const RETRYDELAY = 6;

@Component({
    selector: 'grille, ng-if-simple,ngFor',
    templateUrl: '../html/grille.html',
    styleUrls: ['../css/styles.css']
})



export class GrilleComponent {


    private matrixInitial: number[][] = [];
    private matrixValidation: number[][] = [];
    private lastId = "";
    public id: string[][] = [];
    public level = "Facile";
    public username: string;
    private difficulty: number;
    private sudokuLogiqueFonctions: SudokuLogiqueFonctions = new SudokuLogiqueFonctions();

    constructor(private sudokuService: SudokuService, private timerService: TimerService,
        private loginService: LoginService,
        public dialog: MdDialog) {
    }

    ngOnInit() {
        this.username = this.loginService.getName();
        this.getMatrixEasy();
        this.initialiser_id();
    }

    getMatrixEasy() {
        this.level = "Facile";
        this.difficulty = 0;
        let matrice: number[][];
        this.timerService.resetTimer();
        this.getMatrixEasyRequest(matrice);
    }

    getMatrixHard() {
        this.level = "Difficile";
        this.difficulty = 1;
        let matrice: number[][];
        this.timerService.resetTimer();
        this.getMatrixHardRequest(matrice);
    }

    private getMatrixEasyRequest(matrice: number[][]) {
        this.sudokuService.getSudokuFacile()
            .then((x) => {
                if (x !== null) {
                    this.set_matrixs(x);
                }
                else {
                    this.no_matrix_in_server_message(0);
                    throw new Error("Nothing found");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    private getMatrixHardRequest(matrice: number[][]) {
        this.sudokuService.getSudokuDifficile()
            .then((x) => {
                if (x !== null) {
                    this.set_matrixs(x);
                }
                else {
                    this.no_matrix_in_server_message(1);
                    throw new Error("Nothing found");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    //level = 0 easy and 1 for hard
    private no_matrix_in_server_message(level: number) {
        this.timerService.resetTimer();
        alert("Retrying in " + RETRYDELAY + " seconds.");
        setTimeout(() => {
            if (level === 0) {
                this.getMatrixEasy();
            }
            else if (level === 1) {
                this.getMatrixHard();
            }
        }, RETRYDELAY * 1000);
    }

    //set la matrice initial et la matrice de validation
    private set_matrixs(x: number[][]) {
        this.matrixInitial = x;
        this.copy(x);
        this.sudokuService.setMatrix(x);
        this.timerService.startTimer();
    }

    //fonction pour copier la matrice recu par le serveur a la matrice de validation
    private copy(matrix: number[][]) {
        let tempMatrix: number[][] = [];
        for (let i = 0; i < 9; i++) {
            let temp: number[] = [];
            for (let j = 0; j < 9; j++) {
                temp.push(matrix[i][j]);
            }
            tempMatrix.push(temp);
        }
        this.matrixValidation = tempMatrix;
    }

    // recoit la commande clavier et la traite
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {

        // si boutton droit
        if (event.keyCode === Direction.RIGHT) {
            this.move_indicator_right();
        }
        // si boutton bas
        if (event.keyCode === Direction.DOWN) {
            this.move_indicator_down();
        }
        // si boutton haut
        if (event.keyCode === Direction.UP) {
            this.move_indicator_up();
        }
        // si boutton gauche
        if (event.keyCode === Direction.LEFT) {
            this.move_indicator_left();
        }
    }

    // positionner selon la direction entree
    private move_indicator_left() {
        this.goToNextEmptyBox(0);
    }
    private move_indicator_right() {
        this.goToNextEmptyBox(1);
    }
    private move_indicator_down() {
        this.goToNextEmptyBox(2);
    }
    private move_indicator_up() {
        this.goToNextEmptyBox(3);
    }



    private set_click_focus(x: number, y: number) {
        document.getElementById(this.id[x][y]).focus();
        document.getElementById(this.id[x][y]).click();
    }

    private initialiser_id() {
        for (let i = 0; i < 9; i++) {
            let temp: string[] = [];
            for (let j = 0; j < 9; j++) {
                let position: string = "" + i + "" + j;
                temp.push(position);
            }
            this.id.push(temp);
        }
    }

    private sudokuFinished() {
        this.timerService.stopTimer();
        this.sudokuService.postPlayerScore(this.username,
            this.difficulty,
            this.timerService.getCurrentTime().toString())
            .then((res) => {
                if (res) {
                    this.dialog.open(LeaderboardComponent);
                }
            });
    }

    onKey(event: any) {
        let num: number = this.value_input_number_cast(event);
        let position: number = Number(event.target.id);
        let x: number = Math.floor(position / 10);
        let y: number = position % 10;

        if (num < 1 || num > 9 || isNaN(num)) {
            event.target.value = "";
            this.matrixValidation[x][y] = 0;
            this.check_validation_input(x, y, num);
        } else {
            this.check_validation_input(x, y, num);
        }

    }

    private check_validation_input(x: number, y: number, num: number) {
        this.matrixValidation[x][y] = num;
        this.reset_text_color();
        let allCaseValid = true;
        let noEmptyCase = true;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {

                if (!this.sudokuLogiqueFonctions.isValid(i, j, this.matrixValidation, false)) {
                    document.getElementById(this.id[i][j]).style.color = "#B71C1C";
                    allCaseValid = false;
                }

                if (this.matrixValidation[i][j] === 0) {
                    noEmptyCase = false;
                }

            }
        }

        this.validate_sudoku(allCaseValid, noEmptyCase);
    }

    private validate_sudoku(allCaseValid: boolean, noEmptyCase: boolean) {
        if (allCaseValid && noEmptyCase) {
            this.sudokuFinished();
        }
    }

    clicked(event: any) {
        if (this.lastId !== "") {
            document.getElementById(this.lastId).className = "DivRegulier";
        }
        this.lastId = event.target.id;
        document.getElementById(this.lastId).className = "DivSelectionner";
    }

    reset_matrix() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.matrixInitial[i][j] === 0) {
                    let id: string = this.id[i][j];
                    this.matrixValidation[i][j] = this.matrixInitial[i][j];
                    (<HTMLInputElement>document.getElementById(id)).value = "";
                }

            }
        }
        this.reset_text_color();
    }


    private value_input_number_cast(event: any) {
        let valueString: string = event.target.value;
        return Number(valueString);
    }
    private set_color_id_black(x: number, y: number) {
        document.getElementById(this.id[x][y]).style.color = "#fff";
    }

    private reset_text_color() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.set_color_id_black(i, j);
            }
        }
    }

    // trouve la prochaine case vide selon la direction demande
    private goToNextEmptyBox(m: number) {
        let position: number = Number(this.lastId); // se positionner a la case presente
        let x: number = Math.floor(position / 10); // index horizontal position courrante
        let y: number = position % 10; // index vertical position courrante

        if (m === 0) {
            this.focus_left(x, y);
        } else if (m === 1) {
            this.focus_right(x, y);
        } else if (m === 2) {
            this.focus_down(x, y);
        } else if (m === 3) {
            this.focus_up(x, y);
        }
    }

    private direction_focus(x: number, i: number): boolean {
        if (this.matrixInitial[x][i] === 0) {
            this.set_click_focus(x, i);
            return true;
        }
    }

    private focus_left(x: number, y: number) {

        const startIndex  = y - 1;
        let i = startIndex;
        do{
            if (i  > -1){
                if (this.direction_focus(x, i)) {
                    break;
                }
                i--;
            }else{
                i = 8;
            }
        }while ( i !== startIndex);
    }
    private focus_right(x: number, y: number) {
        const startIndex  = y + 1;
        let i = startIndex;
        do{
            if (i  < 9){
                if (this.direction_focus(x, i)) {
                    break;
                }
                i++;
            }else{
                i = 0;
            }
        }while ( i !== startIndex);
    }

    private focus_up(x: number, y: number) {
        const startIndex  = x - 1;
        let i = startIndex;

        do{
            if (i  > -1){
                if (this.matrixInitial[i][y] === 0) {
                    this.set_click_focus(i, y);
                    break;
                }
                i--;
            }else{
                i = 8;
            }
        }while ( i !== startIndex);
    }

    private focus_down(x: number, y: number) {
        const startIndex = x + 1;
        let  i = startIndex;

        do{
            if (i < 9){
                if (this.matrixInitial[i][y] === 0) {
                    this.set_click_focus(i, y);
                    break;
                }
                i++;
            }else{
                i = 0;
            }
        }while ( i !== startIndex);
    }


}
