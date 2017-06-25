/*
 * Auteur: Ayoub EL Asry
 */

import { assert, expect } from 'chai';
import { SudokuSolver } from "./Logique_Sudoku/SudokuSolver.js";

const MATRIX_INITIAL = [
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
  [ 4, 5, 6, 7, 8, 9, 1, 2, 3 ],
  [ 7, 8, 9, 1, 2, 3, 4, 5, 6 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 1 ],
  [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
  [ 8, 9, 1, 2, 3, 4, 5, 6, 7 ],
  [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
  [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
  [ 9, 1, 2, 3, 4, 5, 6, 7, 8 ]
];

describe('GENERATE PUZZLE', () => {
  describe('#Number of holes for easy level', () => {
    let subject: SudokuSolver;
    let matrixPuzzle: number[][];
    let numberEmptyCasePuzzle: number;
    let numberEmptyCase: number;

    beforeEach(() => {
      subject = new SudokuSolver(MATRIX_INITIAL, 0);
      matrixPuzzle = subject.generate_puzzle();
      numberEmptyCase = subject.get_number_empty_case();
      numberEmptyCasePuzzle = 0;
    });

    it('should have a puzzle with 53 holes', done => {
      for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
          if (matrixPuzzle[i][j] === 0) { numberEmptyCasePuzzle++; }
        }
      }
      assert.equal(numberEmptyCasePuzzle, numberEmptyCase);
      done();
    });
  });

  describe('#Number of holes for difficult level', () => {
    let subject: SudokuSolver;
    let matrixPuzzle: number[][];
    let numberEmptyCasePuzzle: number;
    let numberEmptyCase: number;

    beforeEach(() => {
      subject = new SudokuSolver(MATRIX_INITIAL, 1);
      matrixPuzzle = subject.generate_puzzle();
      numberEmptyCase = subject.get_number_empty_case();
      numberEmptyCasePuzzle = 0;
    });

    it('should have a puzzle with 53 holes', done => {
      for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
          if (matrixPuzzle[i][j] === 0) { numberEmptyCasePuzzle++; }
        }
      }
      assert.equal(numberEmptyCasePuzzle, numberEmptyCase);
      done();
    });
  });

describe('Matrix solution valide', () => {
    it('The puzzle matrix has a unique solution. This solution is equal to the original matrix.', done => {
      let x = new SudokuSolver(MATRIX_INITIAL, 1);
      let matrixPuzzle = x.generate_puzzle();
      let matrixSolution = x.solve_complete(matrixPuzzle);
      let valide = true;
      for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
          if ( !x.isValid(matrixSolution, matrixSolution[i][j], i, j)) {
            valide = false;
            i = 10;
            j = 10;
          }
        }
      }
      assert.deepEqual(valide, true);
      done();
    });
  });
});

describe("#Create copy of matrix", () => {
    let subject: SudokuSolver;
    let sudokuCopy: number[][];

    beforeEach(() => {
        const level = 0;
        subject = new SudokuSolver(MATRIX_INITIAL, level);
        sudokuCopy = [];
    });

    it("should be the same matrix as the initial matrix", () => {
      subject.copy_value_array(sudokuCopy, MATRIX_INITIAL);
        for (let i = 0; i < 9; i++) {
            expect(sudokuCopy[i]).to.deep.equal(MATRIX_INITIAL[i]);
        }
    });
});
