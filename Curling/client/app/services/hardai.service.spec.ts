import { HardAIService } from './hardai.service';
import { MAXVELOCITY } from './render.service';
import { expect } from 'chai';


//0.0181

describe('HardAIService', function () {
    let hardAI: HardAIService;

    beforeEach(() => {
        chai.config.includeStack = true;
    });

    beforeEach(() => {
        hardAI = new HardAIService();
    });

    it('stone velocity should be maximal', () => {
        let stone = { positionX: 0, positionZ: -240, velocityX: 0, velocityZ: 0 };
        let velocities: number[] = hardAI.hitStone(stone);
        let velocity = Math.sqrt(Math.pow(velocities[0], 2) + Math.pow(velocities[1], 2));
        expect(velocity).to.be.approximately(MAXVELOCITY, 0.1);
    });

    it('stone velocity should have the right direction (negative x)', () => {
        let stone = { positionX : -20, positionZ: -240, velocityX: 0, velocityZ: 0};
        let velocities: number [] = hardAI.hitStone(stone);

        let totalVelocity = Math.sqrt(Math.pow(velocities[0], 2) + Math.pow(velocities[1], 2));
        let angle = Math.acos(velocities[1] / totalVelocity);
        expect(angle).to.be.approximately(0.0555, 0.001);
    });

    it('stone velocity should have correct velocity in X (negative x)', () => {
        let stone = { positionX : -20, positionZ: -240, velocityX: 0, velocityZ: 0};
        let velocities: number [] = hardAI.hitStone(stone);
        expect(velocities[0]).to.be.approximately(-4.99, 0.01);
    });

    it('stone velocity should have the right direction (positive x)', () => {
        let stone = { positionX : 21, positionZ: -292, velocityX: 0, velocityZ: 0};
        let velocities: number [] = hardAI.hitStone(stone);

        let totalVelocity = Math.sqrt(Math.pow(velocities[0], 2) + Math.pow(velocities[1], 2));
        let angle = Math.acos(velocities[1] / totalVelocity);
        expect(angle).to.be.approximately(7 * Math.PI / 180, 0.1);
    });
});

