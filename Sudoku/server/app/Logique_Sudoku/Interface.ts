/*
Author : Ayoub El Asry
A faire : replacer le long code par des function et blinde rle typage
*/

import {SudokuSolver} from "./SudokuSolver";
import {SudokuGenerator} from "./SudokuGenerator";
import {RandomOperation} from "./RandomOperation";

export class Interface{
    private solver: SudokuSolver;
    private generator: SudokuGenerator;
    private operationsRandom: RandomOperation;

    private matrixPuzzle: number[][] = [];
    private matrixSolution: number[][] = [];

    constructor(level: number){
        this.operationsRandom = new RandomOperation(level);
        let operationArray: number[] = this.operationsRandom.getOperationSudoku();
        this.generator = new SudokuGenerator();
        this.matrixSolution = this.generator.generate_sudoku(operationArray);
        this.solver = new SudokuSolver(this.matrixSolution, level);
        this.matrixPuzzle = this.solver.generate_puzzle();

    }

    get_matrixPuzzle(): number[][]{
        return this.matrixPuzzle;
    }
    get_matrixSolution(): number[][]{
        return this.matrixSolution;
    }
}
