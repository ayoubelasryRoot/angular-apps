import { Stone } from './stone';
import { HeadUpService } from '../services/hud.service';
import { CameraService } from '../services/camera.service';

interface StateMachineFlags {
    canPlay: boolean;
    isPlayerUser: boolean;
    isUserSetAction: boolean;
    isStoneUserPlaced: boolean;
    isStoneAIPlaced: boolean;
    aisetAction: boolean;
    start: boolean;
}

export class StateMachine {

    constructor() {
        console.log("FSM Initialized...");
    }

    public isAllStoneStopped(stateMachine: StateMachineFlags, stoneDescArray: Stone[],
        cameraService: CameraService, indexStoneAi: number, indexStonePlayer: number,
        headUpService: HeadUpService, xPositionCam: number): boolean {
        let valueToReturn = true;
        for (let i = 0; i < stoneDescArray.length; i++) {
            if (this.getVelocityModule(stoneDescArray[i]) > 0) {
                valueToReturn = false;
                return false;
            }
        }

        if (valueToReturn && (stateMachine.aisetAction || stateMachine.isUserSetAction)) {
            cameraService.setStartingPositionCam();
            xPositionCam = 0;
            if (stateMachine.isPlayerUser) {
                stateMachine.isPlayerUser = false;
                stateMachine.isStoneAIPlaced = false;
                stateMachine.isUserSetAction = false;
                indexStonePlayer++;
                headUpService.headUpScene.remove(headUpService.stoneReminingPlayer);
                headUpService.setReminingStonesPlayer(7 - indexStonePlayer);
            } else {
                stateMachine.isPlayerUser = true;
                stateMachine.isStoneUserPlaced = false;
                stateMachine.aisetAction = false;
                indexStoneAi++;
                headUpService.enableSpeedSelector();
                headUpService.headUpScene.remove(headUpService.stoneReminingAi);
                headUpService.setReminingStonesAi(14 - indexStoneAi);
            }
        }
        return valueToReturn;
    }

    public getVelocityModule(stone: Stone): number {
        return Math.pow(stone.velocityX, 2)
            + Math.pow(stone.velocityZ, 2);
    }

}
