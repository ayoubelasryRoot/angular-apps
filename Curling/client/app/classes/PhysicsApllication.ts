import { PhysicsService, Spin, Sweep } from '../services/physics.service';
import { Stone } from './stone';
import { StateMachine } from './StateMachineApllication';
import { HeadUpService } from '../services/hud.service';

interface StateMachineFlags {
    canPlay: boolean;
    isPlayerUser: boolean;
    isUserSetAction: boolean;
    isStoneUserPlaced: boolean;
    isStoneAIPlaced: boolean;
    aisetAction: boolean;
    start: boolean;
}

export class PhysicsApllication {

    constructor( private physics : PhysicsService, private stateMachineApllication : StateMachine) {}

    public translateObject(i: number,
        deltaT: number,
        stoneArray: THREE.Mesh[],
        stoneDescArray: Stone[],
        stateMachine: StateMachineFlags,
        headUpService: HeadUpService) {
            stoneArray[i].position.z -= deltaT * stoneDescArray[i].velocityZ;
    stoneArray[i].position.x += deltaT * stoneDescArray[i].velocityX;
        stoneDescArray[i].positionX = stoneArray[i].position.x;
        stoneDescArray[i].positionZ = stoneArray[i].position.z;
        this.physics.updateStoneVelocity(stoneDescArray[i], deltaT);
        if (stateMachine.isPlayerUser) {
            if (headUpService.leftSpinSelected) {
                stoneDescArray[i].spin = Spin.left;
               stoneArray[i].rotateY(deltaT);
                this.physics.curlStone(stoneDescArray[i]);
            }
            else if (headUpService.rightSpinSelected) {
                stoneDescArray[i].spin = Spin.right;
                stoneArray[i].rotateY(-deltaT);
                this.physics.curlStone(stoneDescArray[i]);
            }
        }
    }


    public isDistanceCollision(i: number, j: number, stoneArray : THREE.Mesh[]) {
        let deltaX = stoneArray[i].position.x - stoneArray[j].position.x;
        let deltaY = stoneArray[i].position.z - stoneArray[j].position.z;
        let distance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        distance = Math.sqrt(distance);
        if (distance < 9.3) {
            return true;
        }
        return false;
    }

    public findElement(array: number[], value: number): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }


    public animateBroom(index: number, broomGreen : THREE.Mesh, stoneArray : THREE.Mesh[]): void {
        this.physics.sweepTheIce(Sweep.easy);
        for (let i = 0; i < 50; i++) {
            broomGreen.position.x = stoneArray[index].position.x + 1.5;
        }
        for (let i = 0; i < 50; i++) {
            broomGreen.position.x = stoneArray[index].position.x - 1.5;
        }
        this.physics.sweepTheIce(Sweep.none);
    }


}
