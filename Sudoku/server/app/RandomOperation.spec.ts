/*Auteur : Salah Eddine Kamate */

import { assert } from 'chai';
import {RandomOperation} from "./Logique_Sudoku/RandomOperation.js";

let easyLevel = 0;
let hardLevel = 1;
let generalThreshold = 50;
let successiveOp = 0;


describe('Random Operation', () => {
    describe ('threhold easy level', () => {
            it ('The threshold corresponds to the entered level, as expected', done => {

                let a = new RandomOperation(easyLevel);
                let b = a.generateDifficultyThreshold();
                assert.isAtMost(b, generalThreshold);
                done();
            });
        });

      describe ('threhold hard level', () => {
            it ('The threshold corresponds to the entered level, as expected', done => {
                let c = new RandomOperation(hardLevel);
                let d = c.generateDifficultyThreshold();
                assert.isAtLeast(d, generalThreshold);
                done();
            });
        });

      describe ('Operations in hard level', () => {
            it ('The same operation is not called 2 times in row', done => {
                let e = new RandomOperation(hardLevel);

                let opTable = e.getOperationSudoku();

                for (let i = 0; i < opTable.length; i++) {
                    if (opTable[i] === e.threshold && i < e.threshold - 1){
                        successiveOp++;
                    }
                }
                assert.equal(successiveOp, 0);
                done();
            });
        });

       describe ('Operations in easy level', () => {
            it ('The same operation is not called 2 times in row', done => {
                let e = new RandomOperation(easyLevel);

                let opTable = e.getOperationSudoku();
                for (let i = 0; i < opTable.length; i++) {
                    if (opTable[i] === e.threshold && i < e.threshold - 1){
                        successiveOp++;
                    }
                }
                assert.equal(successiveOp, 0);
                done();
            });
    });
});
