/*
 * Auteur: Ayoub EL Asry
 */

import { assert } from 'chai';
import { ScoreCalculator } from "./ScoreCalculator";


describe('BONUS CASE WORD X3', () => {
  describe('#Test word x 3 HORIZANTAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(0, 0, [3, 1, 1], 'h');
    });

    it('Word score [3, 1, 1]  at A, 1 Horisontal equal to 15', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(15, score);
      done();
    });

  });

  describe('#Test word x 3 VERTICAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(0, 0, [3, 1, 1], 'v');
    });

    it('Word score [3, 1, 1]  at (A, 1) VERTICAL equal to 15', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(15, score);
      done();
    });

  });


});

describe('BONUS CASE CHAR X3', () => {
  describe('#Test char x 3 HORIZANTAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(1, 5, [3, 1, 1], 'h');
    });

    it('Word score [3, 1, 1]  at (B, 6) Horisontal equal to 11', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(11, score);
      done();
    });

  });

  describe('#Test char x 3 VERTICAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(1, 5, [3, 1, 1], 'v');
    });

    it('Word score [3, 1, 1]  at (B, 6) VERTICAL equal to 11', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(11, score);
      done();
    });

  });


});



describe('BONUS CASE WORD X2', () => {
  describe('#Test word x 2 HORIZANTAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(1, 1, [3, 1, 1], 'h');
    });

    it('Word score [3, 1, 1]  at (B, 2) Horisontal equal to 10', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(10, score);
      done();
    });

  });

  describe('#Test word x 2 VERTICAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(1, 1, [3, 1, 1], 'v');
    });

    it('Word score [3, 1, 1]  at (B, 2) VERTICAL equal to 10', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(10, score);
      done();
    });

  });
});


describe('BONUS CASE CHAR X2', () => {
  describe('#Test char x 2 HORIZANTAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(0, 3, [3, 1, 1], 'h');
    });

    it('Word score [3, 1, 1]  at (A, 4) Horisontal equal to 8', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(8, score);
      done();
    });

  });

  describe('#Test char x 2 VERTICAL', () => {
    let subject: ScoreCalculator;
    beforeEach(() => {
      subject = new ScoreCalculator();
      subject.setWordData(0, 3, [3, 1, 1], 'v');
    });

    it('Word score [3, 1, 1]  at (A, 4) VERTICAL equal to 8', done => {
      let score = subject.getScoreWord();
      assert.deepEqual(8, score);
      done();
    });

  });
});



