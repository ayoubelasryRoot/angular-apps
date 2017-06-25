import { Injectable } from '@angular/core';
import { MAXVELOCITY, StartingPosition } from './render.service';
import { Stone } from '../classes/stone';

const PRECISEVELOCITY = 52.4;

@Injectable()

export class HardAIService {
    //Returns velocity to land the stone directly on home
    public velocityToHome(): number[] {
        let velocityX = 0;
        let velocityZ = PRECISEVELOCITY;
        return [velocityX, velocityZ];
    }

    //Returns velocity to knock stone out of game
    public hitStone(stone: Stone): number[] {
        //dx w/ adjustment to knock stone out of play with an angle
        let dx = Math.abs(stone.positionX - StartingPosition.x);
        let dz = Math.abs(stone.positionZ - Math.abs(StartingPosition.z));
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));
        let angle = Math.acos(dz / distance);

        let velocityX = MAXVELOCITY * Math.sin(angle);
        velocityX *= (stone.positionX < StartingPosition.x) ? -1 : 1;

        let velocityZ = MAXVELOCITY * Math.cos(angle);

        return [velocityX, velocityZ];
    }
}
