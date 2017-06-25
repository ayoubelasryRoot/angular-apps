/*
 * Alexandre Hua
 */

import { expect } from 'chai';
import { Grid } from "./grid";
import { Letter } from "./letter";
import * as Constant from "../StaticValues/constant";

describe("Word Validation Operations", () => {

    describe("#OverFlow Validation", () => {
        let subject: Grid;
        let word: string;

        beforeEach(() => {
            subject = new Grid();
            word = 'word';
        });

        it("should overflow horizontally", () => {
            let isOverflow: boolean;
            subject.setWordForValidation(word, 5, 12, 'h');
            isOverflow = subject.isOverFlowHorizontal();

            expect(isOverflow).to.be.true;

            subject.setWordForValidation(word, 5, -1, 'h');
            isOverflow = subject.isOverFlowHorizontal();

            expect(isOverflow).to.be.true;

            subject.setWordForValidation(word, 5, 20, 'h');
            isOverflow = subject.isOverFlowHorizontal();

            expect(isOverflow).to.be.true;
        });

        it("should overflow vertically", () => {
            let isOverflow: boolean;
            subject.setWordForValidation(word, 12, 5, 'v');
            isOverflow = subject.isOverFlowVertical();

            expect(isOverflow).to.be.true;

            subject.setWordForValidation(word, -1, 5, 'v');
            isOverflow = subject.isOverFlowVertical();

            expect(isOverflow).to.be.true;

            subject.setWordForValidation(word, 20, 5, 'v');
            isOverflow = subject.isOverFlowVertical();

            expect(isOverflow).to.be.true;
        });

        it("should not overflow horizontally", () => {
            let isOverflow: boolean;

            subject.setWordForValidation(word, 5, 5, 'h');
            isOverflow = subject.isOverFlowHorizontal();

            expect(isOverflow).to.be.false;

            subject.setWordForValidation(word, 5, 11, 'h');
            isOverflow = subject.isOverFlowHorizontal();

            expect(isOverflow).to.be.false;
        });

        it("should not overflow vertically", () => {
            let isOverflow: boolean;

            subject.setWordForValidation(word, 5, 5, 'v');
            isOverflow = subject.isOverFlowVertical();

            expect(isOverflow).to.be.false;

            subject.setWordForValidation(word, 11, 5, 'v');
            isOverflow = subject.isOverFlowVertical();

            expect(isOverflow).to.be.false;
        });
    });

    describe("#First Move Validation", () => {
        let subject: Grid;
        let word: string;
        let lettersUsed: Constant.LetterPosition[];

        beforeEach(() => {
            subject = new Grid();
            word = 'word';
            lettersUsed = [];
        });

        it("should not be valid", () => {
            let isValid: Constant.ErrorCode;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 5, col: 5 + i });
            }

            subject.setWordForValidation(word, 5, 5, 'h');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();
            isValid = subject.isFirstOperationCleared();

            expect(isValid).to.be.equal(Constant.ErrorCode.RULE_ERROR);
        });

        it("should be valid", () => {
            let isValid: Constant.ErrorCode;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 7, col: 7 + i });
            }

            subject.setWordForValidation(word, 7, 7, 'h');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();
            isValid = subject.isFirstOperationCleared();

            expect(isValid).to.be.equal(Constant.ErrorCode.NO_ERROR);
        });

        it("should remain valid", () => {
            let isValid: Constant.ErrorCode;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 7, col: 7 + i });
            }

            subject.setWordForValidation(word, 7, 7, 'h');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();
            isValid = subject.isFirstOperationCleared();

            expect(isValid).to.be.equal(Constant.ErrorCode.NO_ERROR);

            subject.setWordForValidation(word, 5, 5, 'h');
            subject.placeNewWord();
            isValid = subject.isFirstOperationCleared();

            expect(isValid).to.be.equal(Constant.ErrorCode.NO_ERROR);
        });
    });

    describe("#Conflict Validation", () => {
        let subject: Grid;
        let word: string;
        let wordTest: string;
        let lettersUsed: Constant.LetterPosition[];

        beforeEach(() => {
            subject = new Grid();
            word = 'word';
            wordTest = 'void';
            lettersUsed = [];
        });

        it("should conflict with horizontal word on grid", () => {
            let isConflicted: boolean;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 7, col: 7 + i });
            }

            subject.setWordForValidation(word, 7, 7, 'h');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();

            subject.setWordForValidation(word, 6, 7, 'v');
            isConflicted = subject.isConflictedWithHorizontalWord();

            expect(isConflicted).to.be.true;
        });

        it("should not conflict with horizontal word on grid", () => {
            let isConflicted: boolean;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 7, col: 7 + i });
            }

            subject.setWordForValidation(word, 7, 7, 'h');
            subject.setLettersUsed(lettersUsed);
            subject.placeNewWord();
            subject.setWordForValidation(word, 6, 8, 'v');
            isConflicted = subject.isConflictedWithHorizontalWord();

            expect(isConflicted).to.be.false;
        });

        it("should conflict with vertical word on grid", () => {
            let isConflicted: boolean;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 7 + i, col: 7 });
            }

            subject.setWordForValidation(word, 7, 7, 'v');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();

            subject.setWordForValidation(word, 7, 6, 'h');
            isConflicted = subject.isConflictedWithVerticalWord();

            expect(isConflicted).to.be.true;
        });

        it("should not conflict with vertical word on grid", () => {
            let isConflicted: boolean;

            for (let i = 0; i < word.length; i++) {
                lettersUsed.push({ letter: new Letter(word[i]), row: 7 + i, col: 7 });
            }

            subject.setWordForValidation(word, 7, 7, 'v');
            subject.setLettersUsed(lettersUsed);
            subject.placeNewWord();
            subject.setWordForValidation(word, 8, 6, 'h');
            isConflicted = subject.isConflictedWithVerticalWord();

            expect(isConflicted).to.be.false;
        });
    });

    describe("#CheckAdjacentWords Operation", () => {
        let subject: Grid;
        let word1: string;
        let word2: string;
        let testWord: string;
        let lettersUsed: Constant.LetterPosition[];

        beforeEach(() => {
            subject = new Grid();
            word1 = 'word';
            word2 = 'test';
            testWord = 'four';
            lettersUsed = [];
        });

        it("should find 4 adjacent horizontal words", () => {
            let adjacentWords: string[] = [];
            let expectedArray: string[] = ['wft', 'ooe', 'rus', 'drt'];

            for (let i = 0; i < word1.length; i++) {
                subject.putLetter(new Letter(word1[i]), 5 + i, 5);
            }

            for (let i = 0; i < word2.length; i++) {
                subject.putLetter(new Letter(word2[i]), 5 + i, 7);
            }

            for (let i = 0; i < testWord.length; i++) {
                lettersUsed.push({ letter: new Letter(testWord[i]), row: 5 + i, col: 6 });
            }
            subject.setWordForValidation(testWord, 5, 6, 'v');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();
            let data: { word: string, row: number, col: number }[] = subject.checkAdjacentHorizontalWords();

            data.forEach((element: { word: string, row: number, col: number }) => {
                adjacentWords.push(element.word);
            });

            expect(adjacentWords).to.have.members(expectedArray);
        });

        it("should find 2 adjacent horizontal words", () => {
            let adjacentWords: string[] = [];
            let expectedArray: string[] = ['df', 'rt'];

            for (let i = 0; i < word1.length; i++) {
                subject.putLetter(new Letter(word1[i]), 1 + i, 5);
            }

            for (let i = 0; i < word2.length; i++) {
                subject.putLetter(new Letter(word2[i]), 7 + i, 7);
            }

            for (let i = 0; i < testWord.length; i++) {
                lettersUsed.push({ letter: new Letter(testWord[i]), row: 4 + i, col: 6 });
            }

            subject.setWordForValidation('four', 4, 6, 'v');
            subject.setLettersUsed(lettersUsed);
            subject.placeNewWord();
            let data: { word: string, row: number, col: number }[] = subject.checkAdjacentHorizontalWords();

            data.forEach((element: { word: string, row: number, col: number }) => {
                adjacentWords.push(element.word);
            });

            expect(adjacentWords).to.have.members(expectedArray);
        });

        it("should find 4 adjacent vertical words", () => {
            let adjacentWords: string[] = [];
            let expectedArray: string[] = ['wft', 'ooe', 'rus', 'drt'];

            for (let i = 0; i < word1.length; i++) {
                subject.putLetter(new Letter(word1[i]), 5, 5 + i);
            }

            for (let i = 0; i < word2.length; i++) {
                subject.putLetter(new Letter(word2[i]), 7, 5 + i);
            }

            for (let i = 0; i < testWord.length; i++) {
                lettersUsed.push({ letter: new Letter(testWord[i]), row: 6, col: 5 + i });
            }

            subject.setWordForValidation('four', 6, 5, 'h');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();
            let data: { word: string, row: number, col: number }[] = subject.checkAdjacentVerticalWords();

            data.forEach((element: { word: string, row: number, col: number }) => {
                adjacentWords.push(element.word);
            });

            expect(adjacentWords).to.have.members(expectedArray);
        });

        it("should find 2 adjacent vertical words", () => {
            let adjacentWords: string[] = [];
            let expectedArray: string[] = ['df', 'rt'];

            for (let i = 0; i < word1.length; i++) {
                subject.putLetter(new Letter(word1[i]), 5, 1 + i);
            }

            for (let i = 0; i < word2.length; i++) {
                subject.putLetter(new Letter(word2[i]), 7, 7 + i);
            }

            for (let i = 0; i < testWord.length; i++) {
                lettersUsed.push({ letter: new Letter(testWord[i]), row: 6, col: 4 + i });
            }

            subject.setWordForValidation('four', 6, 4, 'h');
            subject.setLettersUsed(lettersUsed);

            subject.placeNewWord();
            let data: { word: string, row: number, col: number }[] = subject.checkAdjacentVerticalWords();

            data.forEach((element: { word: string, row: number, col: number }) => {
                adjacentWords.push(element.word);
            });

            expect(adjacentWords).to.have.members(expectedArray);
        });
    });

    describe("#Word Connection Validation", () => {
        let subject: Grid;
        let word: string;
        let firstWord: string;

        beforeEach(() => {
            subject = new Grid();
            firstWord = 'word';
            word = 'four';
            for (let i = 0; i < firstWord.length; i++) {
                subject.putLetter(new Letter(firstWord[i]), 7, 7 + i);
            }
        });

        it("should not consider word connection on first turn", () => {
            let errorCode: Constant.ErrorCode;

            subject.setWordForValidation(word, 7, 7, 'h');
            subject.isConflicted();
            subject.checkAdjacentWords();
            errorCode = subject.isWordConnected();

            expect(errorCode).to.equal(Constant.ErrorCode.NO_ERROR);
        });

        it("should not be connected with grid words", () => {
            let errorCode: Constant.ErrorCode;

            subject.setIsFirstTurn(false);
            subject.setWordForValidation(word, 4, 4, 'h');
            subject.isConflicted();
            subject.checkAdjacentWords();
            errorCode = subject.isWordConnected();

            expect(errorCode).to.equal(Constant.ErrorCode.RULE_ERROR);
        });

        it("should be connected with horizontal word", () => {
            let errorCode: Constant.ErrorCode;

            subject.setIsFirstTurn(false);
            subject.setWordForValidation(word, 6, 7, 'h');
            subject.isConflicted();
            subject.checkAdjacentWords();
            errorCode = subject.isWordConnected();

            expect(errorCode).to.equal(Constant.ErrorCode.NO_ERROR);
        });

        it("should be connected with vertical word", () => {
            let errorCode: Constant.ErrorCode;

            subject.setIsFirstTurn(false);
            subject.setWordForValidation(word, 6, 11, 'v');
            subject.isConflicted();
            subject.checkAdjacentWords();
            errorCode = subject.isWordConnected();

            expect(errorCode).to.equal(Constant.ErrorCode.NO_ERROR);
        });

        it("should be connected with crossed word", () => {
            let errorCode: Constant.ErrorCode;

            subject.setIsFirstTurn(false);
            subject.setWordForValidation(firstWord, 6, 8, 'v');
            subject.isConflicted();
            subject.checkAdjacentWords();
            errorCode = subject.isWordConnected();

            expect(errorCode).to.equal(Constant.ErrorCode.NO_ERROR);
        });
    });

    describe("#Real Word Verification", () => {
        let subject: Grid;
        let word: string;
        let firstWord: string;
        let realWord: string;

        beforeEach(() => {
            subject = new Grid();
            firstWord = 'word';
            word = 'e';
            for (let i = 0; i < firstWord.length; i++) {
                subject.putLetter(new Letter(firstWord[i]), 7, 7 + i);
            }
            subject.setIsFirstTurn(false);
        });

        it("should be the same word as the original", () => {
            subject.setWordForValidation(word, 4, 4, 'h');
            subject.isConflicted();
            realWord = subject.checkRealWord();

            expect(realWord).to.equal(word);
        });

        it("should be a word composed of first and second word vertically", () => {
            let expectedWord1 = 'ew';
            let expectedWord2 = 'de';
            subject.setWordForValidation(word, 6, 7, 'v');
            subject.isConflicted();
            subject.placeNewWord();
            realWord = subject.checkRealWord();

            expect(realWord).to.equal(expectedWord1);

            subject.setWordForValidation(word, 8, 10, 'v');
            subject.isConflicted();
            subject.placeNewWord();
            realWord = subject.checkRealWord();

            expect(realWord).to.equal(expectedWord2);
        });

        it("should be a word composed of first and second word horizontally", () => {
            let expectedWord1 = 'eword';
            let expectedWord2 = 'eworde';
            subject.setWordForValidation(word, 7, 6, 'h');
            subject.isConflicted();
            subject.placeNewWord();
            realWord = subject.checkRealWord();

            expect(realWord).to.equal(expectedWord1);

            subject.setWordForValidation(word, 7, 11, 'h');
            subject.isConflicted();
            subject.placeNewWord();
            realWord = subject.checkRealWord();

            expect(realWord).to.equal(expectedWord2);
        });
    });
});
