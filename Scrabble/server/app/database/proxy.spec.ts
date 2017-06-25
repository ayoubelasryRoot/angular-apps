import { DatabaseProxy } from './proxy';
import { expect } from 'chai';

describe('A dictionary ', () => {
    let database = new DatabaseProxy();

    it('should be able to be loaded', done => {
        expect(database).to.not.be.undefined;
        done();
    });

    it('should contain a valid word', done => {
        const validWord = "ABAT";
        database.validateWord(validWord)
            .then((isPresent) => {
                expect(isPresent).to.be.true;
                done();
            });
    });

    it('should not validate an invalid word', function (done) {
        this.timeout(10000);
        const validWord = "BEST";
        database.validateWord(validWord)
            .then((isPresent) => {
                expect(isPresent).to.be.false;
                done();
            });
    });
});
