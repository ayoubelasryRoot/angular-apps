import {DbController} from './db-controller';

import { expect} from 'chai';

describe('A Database Controller ', () => {

    it ('should exist after creation ', () => {
        let dbC = new DbController(1);
        expect(dbC).to.exist;
    });

    it('should be created with an ID', done => {
        let expectedId = 42;
        let dbC = new DbController(expectedId);
        expect(dbC.getId()).to.equal(expectedId);
        done();
    });

    it('should have a name', () => {
        let expectedString = "Something";
        let dbC = new DbController(0);
        expect(dbC.getSomething()).to.equal(expectedString);
    });

    it('should throw an Error upon asking for it', () => {
        let dbC = new DbController(0);
        expect(dbC.giveMeError).to.throw(Error);
    });

});
