/*
 * Auteur: Ayoub EL Asry
 */

import { assert, expect } from 'chai';
import { SudokuLogiqueFonctions } from "./SudokuLogiqueFonctions";

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

const MATRIX_INITIAL_2 = [
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
  [ 4, 5, 6, 7, 8, 9, 1, 2, 3 ],
  [ 7, 0, 9, 1, 2, 3, 4, 5, 0 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 1 ],
  [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
  [ 8, 9, 1, 0, 3, 4, 5, 6, 7 ],
  [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
  [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
  [ 9, 1, 2, 3, 4, 5, 6, 0, 8 ]
];

const MATRIX_INITIAL_3 = [
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
  [ 4, 1, 6, 7, 8, 9, 0, 2, 3 ],
  [ 7, 0, 9, 1, 2, 3, 4, 5, 0 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 1 ],
  [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
  [ 8, 9, 1, 0, 3, 4, 5, 6, 7 ],
  [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
  [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
  [ 9, 0, 2, 3, 4, 5, 6, 0, 8 ]
];

const MATRIX_INITIAL_4 = [
  [ 1, 2, 3, 4, 5, 6, 7, 8, 1 ],
  [ 4, 1, 6, 7, 8, 9, 0, 2, 3 ],
  [ 7, 0, 9, 1, 2, 3, 4, 5, 0 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 0 ],
  [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
  [ 8, 9, 1, 0, 3, 4, 5, 6, 7 ],
  [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
  [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
  [ 9, 0, 2, 3, 4, 5, 6, 0, 8 ]
];
const MATRIX_INITIAL_5 = [
  [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
  [ 4, 1, 6, 7, 8, 9, 0, 2, 3 ],
  [ 7, 0, 9, 1, 2, 3, 4, 5, 0 ],
  [ 2, 3, 4, 5, 6, 7, 8, 9, 1 ],
  [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
  [ 8, 9, 1, 0, 3, 4, 5, 6, 7 ],
  [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
  [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
  [ 1, 0, 2, 3, 4, 5, 6, 0, 8 ]
];

describe('LOGIQUE GIRILLE', () => {
  describe('#Creation de id', () => {
    let subject: SudokuLogiqueFonctions;
    let matrixID: string[][];
    beforeEach(() => {
      subject = new SudokuLogiqueFonctions();
      matrixID = subject.get_matrix_id();
    });

    it('La matrice des ID doit contenire des iterations 00, 01, 02,..., 88', done => {
        let equal  = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if (matrixID[i][j] !== (""+i+j)) {
                    equal = false;
                }
            }
        }
      assert.equal(true, equal);
      done();
    });

  });


  describe('#Methode de validation general', () => {
    let subject: SudokuLogiqueFonctions;
    beforeEach(() => {
      subject = new SudokuLogiqueFonctions();
    });

    it('Matrice remplie valide', done => {
        let valide  = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if(!subject.isValid(i, j, MATRIX_INITIAL, true)){
                    valide = false;
                }
            }
        }
      assert.equal(true, valide);
      done();
    });

    it('Matrice avec des case vide mais valide', done => {
        let valide  = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if(!subject.isValid(i, j, MATRIX_INITIAL_2, true)){
                    valide = false;
                }
            }
        }
      assert.equal(true, valide);
      done();
    });

  });


  describe('#Validation specifique', () => {
    let subject: SudokuLogiqueFonctions;
    beforeEach(() => {
      subject = new SudokuLogiqueFonctions();
    });
    it('Erreur dans le carre', done => {
        let valide  = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if(!subject.isValid(i, j, MATRIX_INITIAL_3, true)){
                    valide = false
                }
            }
        }
      assert.equal(false, valide);
      done();
    });

    it('Erreur dans la ligne', done => {
        let valide  = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if(!subject.isValid(i, j, MATRIX_INITIAL_4, true)){
                    valide = false
                }
            }
        }
      assert.equal(false, valide);
      done();
    });

    it('Erreur dans la colonne', done => {
        let valide  = true;
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if(!subject.isValid(i, j, MATRIX_INITIAL_5, true)){
                    valide = false
                }
            }
        }
      assert.equal(false, valide);
      done();
    });

  });


});
