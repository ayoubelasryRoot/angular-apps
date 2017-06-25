/*
 * Alexandre Hua
 */

import { assert, expect} from 'chai';
import { SudokuGenerator } from "./Logique_Sudoku/SudokuGenerator.js";

describe("GENERATE SUDOKU", () => {
    let subject: SudokuGenerator;
    let sudoku: number[][];
    let randomOperation: number[];
    const ALL_DIGIT: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    describe("#Initial Sudoku validation", () => {
        beforeEach(() => {
            subject = new SudokuGenerator();
            sudoku = subject.matrix_initial;
        });

        it("all row should have 1 to 9", () => {
            for (let i = 0; i < 9; i++) {
                assert.sameMembers(sudoku[i], ALL_DIGIT, "contains 1 to 9");
            }
        });

        it("all column should have 1 to 9", () => {
            let tempcolumn : number[] = [];
            for (let j = 0; j < 9; j++) {
                for (let i = 0; i < 9; i++) {
                    tempcolumn.push(sudoku[i][j]);
                }
                assert.sameMembers(tempcolumn, ALL_DIGIT, "contains 1 to 9");
                tempcolumn.length = 0;
            }
        });

        it("all block 3x3 should have 1 to 9", () => {
            let tempblock : number[] = [];
            for (let k = 0; k < 3; k++) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row : number = 3 * k + i;
                        let col : number = 3 * k + j;
                        tempblock.push( sudoku[row][col] );
                    }
                }
                assert.sameMembers(tempblock, ALL_DIGIT, "contains 1 to 9");
            }
        });
    });

    describe("#Final Sudoku validation", () => {
        beforeEach(() => {
            subject = new SudokuGenerator();
            randomOperation = [1, 5, 3, 2, 4, 1, 3, 4, 0];
            sudoku = subject.generate_sudoku(randomOperation);
        });

        it("all row should have 1 to 9", () => {
            for (let i = 0; i < 9; i++) {
                assert.sameMembers(sudoku[i], ALL_DIGIT, "contains 1 to 9");
            }
        });

        it("all column should have 1 to 9", () => {
            let tempcolumn : number[] = [];
            for (let j = 0; j < 9; j++) {
                for (let i = 0; i < 9; i++) {
                    tempcolumn.push(sudoku[i][j]);
                }
                assert.sameMembers(tempcolumn, ALL_DIGIT, "contains 1 to 9");
                tempcolumn.length = 0;
            }
        });

        it("all block 3x3 should have 1 to 9", () => {
            let tempblock : number[] = [];
            for (let k = 0; k < 3; k++) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        let row : number = 3 * k + i;
                        let col : number = 3 * k + j;
                        tempblock.push(sudoku[row][col]);
                    }
                }
                assert.sameMembers(tempblock, ALL_DIGIT, "contains 1 to 9");
            }
        });
    });

    describe("#Create copy of matrix", () => {
        let matrixInitial: number[][];
        let sudokuCopy: number[][];

        beforeEach(() => {
            matrixInitial = subject.matrixFinal;
            sudokuCopy = subject.matrix_final;
        });

        it("should be the same matrix as the initial matrix", () => {
            subject.copy_value_matrix();
            for (let i = 0; i < 9; i++) {
                expect(sudokuCopy[i]).to.deep.equal(matrixInitial[i]);
            }
        });
    });
});

describe("SUDOKU GENERATION OPERATION", () => {

    let subject: SudokuGenerator;
    let matrixInitial: number[][];
    let sudoku: number[][];

    beforeEach(() => {
        subject = new SudokuGenerator();
        matrixInitial = subject.matrix_initial;
        sudoku = subject.matrix_final;
    });

    it("should have the first and second row swapped", () => {
        subject.swap_row(0, 1);

        expect(sudoku[0]).to.deep.equal(matrixInitial[1]);
        expect(sudoku[1]).to.deep.equal(matrixInitial[0]);
    });

    it("should have the first and second column swapped", () => {
        subject.swap_column(0, 1);

        for (let i = 0; i < 9; i++) {
            expect(sudoku[i][0]).to.equal(matrixInitial[i][1]);
            expect(sudoku[i][1]).to.equal(matrixInitial[i][0]);
        }
    });

    it("should have the sudoku flipped horirontally", () => {
        subject.inverse_matrix_horizontal();

        for (let j = 0; j < 9; j++) {
            for (let i = 0; i < 9; i++) {
                expect(sudoku[i][j]).to.equal(matrixInitial[i][8 - j]);
            }
        }
    });

    it("should have the sudoku flipped vertically", () => {
        subject.inverse_matrix_vertical();

        for (let i = 0; i < 9; i++) {
            expect(sudoku[i]).to.deep.equal(matrixInitial[8 - i]);
        }
    });

    it("should have the sudoku flipped from the ascendant diagonal", () => {
        subject.inverse_matrix_diagonal_ascendant();

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                expect(sudoku[i][j]).to.equal(matrixInitial[8 - j][8 - i]);
            }
        }
    });

    it("should have the sudoku flipped from the descendant diagonal", () => {
        subject.inverse_matrix_diagonal_descendant();

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                expect(sudoku[i][j]).to.equal(matrixInitial[j][i]);
            }
        }
    });
});
