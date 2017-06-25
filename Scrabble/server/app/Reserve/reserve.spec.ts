/*
 * Auteur: Ayoub EL Asry
 */

import { assert } from 'chai';
import { Reserve } from "./reserve";
import { Letter } from '../logic/letter';

describe('Reserve', () => {
    describe('Decrementing number of letters', () => {
        let subject: Reserve;
        beforeEach(() => {
            subject = new Reserve();
        });

        it('Check if the new value of number = total -1', done => {
            let total = subject.nbLetter;
            subject.randomLetterGenerator();
            let totalAfterGenerator = subject.remainingLetters;
            assert.deepEqual(total, totalAfterGenerator + 1);
            done();
        });

    });

    describe('Decrementing number of letters', () => {
        let subject: Reserve;
        beforeEach(() => {
            subject = new Reserve();
        });

        it('Check if the new value of number = total -2', done => {
            let total = subject.nbLetter;
            subject.randomLetterGenerator();
            subject.randomLetterGenerator();
            let totalAfterGenerator = subject.remainingLetters;
            assert.deepEqual(total, totalAfterGenerator + 2);
            done();
        });

    });

    describe('Type of response randomLetterGenerator', () => {
        let subject: Reserve;
        beforeEach(() => {
            subject = new Reserve();
        });

        it('Check if the new value of used number = total -1', done => {
            let total = subject.nbLetter;
            subject.randomLetterGenerator();
            let totalAfterGenerator = subject.remainingLetters;
            assert.deepEqual(total, totalAfterGenerator + 1);
            done();
        });

    });

    describe('Check the switch of the letters', () => {
        let subject: Reserve;
        beforeEach(() => {
            subject = new Reserve();
        });

        it('Check if the generated letter is equal to the last letter', done => {
            let lettre: Letter;
            lettre = subject.randomLetterGenerator();
            let size = subject.letters.length;
            assert.deepEqual(lettre.getLetter(), subject.letters[size - 1].getLetter());
            done();
        });

        it('Check if only the last letter is changed', done => {
            let lettre: Letter;
            lettre = subject.randomLetterGenerator();
            let size = subject.letters.length;
            let blankLetter = " ";
            assert.deepEqual(blankLetter, subject.letters[size - 2].getLetter());
            done();
        });

        it('Check if the 2nd generated letter is equal to the last letter - 1', done => {
            let lettre: Letter;
            subject.randomLetterGenerator();
            lettre = subject.randomLetterGenerator();
            let size = subject.letters.length;
            assert.deepEqual(lettre.getLetter(), subject.letters[size - 2].getLetter());
            done();
        });

    });

});
