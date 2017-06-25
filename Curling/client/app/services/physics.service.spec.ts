import { PhysicsService } from './physics.service';
import { Stone } from '../classes/stone';
import { expect } from 'chai';


//0.0181

describe('PhysicsService', function () {
    let service: PhysicsService;

    beforeEach(() => {
        chai.config.includeStack = true;
    });

    beforeEach(() => {
        service = new PhysicsService();
    });

    it('should always fail', done => {
        expect(true).to.be.false;
        done();
    });

    it('stone velocity on x axis should decrease', () => {
        let stone: Stone = { positionX: 0, positionZ: 0, velocityX: 3, velocityZ: 4 };
        service.updateStoneVelocity(stone, 1);
        expect(stone.velocityX).to.be.a('number').and.to.be.approximately(0.9, 0.1);
    });

    it('stone velocity on x axis should decrease (with negative initial x velocity)', () => {
        let stone: Stone = { positionX: 0, positionZ: 0, velocityX: -3, velocityZ: 4 };
        service.updateStoneVelocity(stone, 1);
        expect(stone.velocityX).to.be.a('number').and.to.be.approximately(-0.9, 0.1);
    });

    it('hit stone velocity on x axis should change correctly on collision', () => {
        let stone1: Stone = { positionX: 0, positionZ: 0, velocityX: 2, velocityZ: 3};
        let stone2: Stone = { positionX: 3, positionZ: 4, velocityX: 0, velocityZ: 0};
        service.collide(stone1, stone2);
        expect(stone2.velocityX).to.be.a('number').and.to.be.approximately(2.1, 0.1);
    });

    it('hit stone velocity on z axis should change correctly on collision', () => {
        let stone1: Stone = { positionX: 0, positionZ: 0, velocityX: 2, velocityZ: 3};
        let stone2: Stone = { positionX: 3, positionZ: 4, velocityX: 0, velocityZ: 0};
        service.collide(stone1, stone2);
        expect(stone2.velocityZ).to.be.a('number').and.to.be.approximately(2.8, 0.1);
    });

    it('moving stone velocity on x axis should change correctly on collision #1', () => {
        let stone1: Stone = { positionX: 0, positionZ: 0, velocityX: 2, velocityZ: 3};
        let stone2: Stone = { positionX: 3, positionZ: 4, velocityX: 0, velocityZ: 0};
        service.collide(stone1, stone2);
        expect(stone1.velocityX).to.be.a('number').and.to.be.approximately(0.8, 0.1);
    });

    it('moving stone velocity on x axis should change correctly on collision #2', () => {
        let stone1: Stone = { positionX: 0, positionZ: 0, velocityX: -2, velocityZ: 3};
        let stone2: Stone = { positionX: -3, positionZ: 4, velocityX: 0, velocityZ: 0};
        service.collide(stone1, stone2);
        expect(stone1.velocityX).to.be.a('number').and.to.be.approximately(-0.8, 0.1);
    });

});
