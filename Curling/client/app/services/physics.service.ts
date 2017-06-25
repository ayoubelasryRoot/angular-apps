import { Injectable } from '@angular/core';
import { Stone } from '../classes/stone';

const G = 9.81;
const curlRatio = 0.0002;
export const enum Spin { left = 1, right = -1, none = 0 }
export const enum Sweep { none = 0, easy = 1}

@Injectable()

export class PhysicsService {

    private defaultFriction = 0.35;
    private easyFriction = 0.15;

    private currentFriction = this.defaultFriction;

    constructor() {
        console.log("Physics service initialized...");
    }

    // Friction calculations begin here
    sweepTheIce(sweepLevel: Sweep) {
        switch (sweepLevel) {
            case Sweep.none: this.currentFriction = this.defaultFriction; break;
            case Sweep.easy: this.currentFriction = this.easyFriction; break;
            default: this.currentFriction = this.defaultFriction; break;
        }
    }

    private updateVelocity(currentVelocity: number, dt: number): number {
        let velocity = (currentVelocity - (this.currentFriction * G) * dt);
        return (velocity < 0) ? 0 : velocity;
    }

    private getModuleFromProjection(velocityX: number, velocityZ: number): number {
        return Math.sqrt(Math.pow(velocityX, 2) + Math.pow(velocityZ, 2));
    }

    private getAngleFromProjection(x: number, z: number): number {
        return Math.abs(Math.atan(z / x));
    }

    updateStoneVelocity(stone: Stone, dt: number) {
        let velocityVector = this.getModuleFromProjection(stone.velocityX, stone.velocityZ);
        let angle = this.getAngleFromProjection(stone.velocityX, stone.velocityZ);
        velocityVector = this.updateVelocity(velocityVector, dt);

        if (stone.velocityX < 0) {
            stone.velocityX = -1 * (velocityVector * Math.cos(angle));
        }
        else {
            stone.velocityX = velocityVector * Math.cos(angle);
        }
        stone.velocityZ = velocityVector * Math.sin(angle);
    }

    curlStone(stone: Stone) {
        let velocityVector = this.getModuleFromProjection(stone.velocityX, stone.velocityZ);
        let angle = this.getAngleFromProjection(stone.velocityX, stone.velocityZ);
        let effectiveCurlRadio = curlRatio * (this.currentFriction / this.defaultFriction);
        //Calculate new angle depending on current angle and curl ratio
        //Test is trivial, and calculation of velocity is already being tested
        if (stone.spin === Spin.left) {
            if (stone.velocityX < 0) {
                //If going to the left and spinning towards the left
                angle = (1 - effectiveCurlRadio) * angle;
            }
            else {
                //If going to the right and spinning towards the left
                angle = (1 + effectiveCurlRadio) * angle;
            }
        }
        else if (stone.spin === Spin.right) {
            if (stone.velocityX < 0) {
                //If going to the left and spinning towards the right
                angle = (1 + effectiveCurlRadio) * angle;
            }
            else {
                //If going to the right and spinning towards the right
                angle = (1 - effectiveCurlRadio) * angle;
            }
        }
        else {
            //if not spinning, don't curl
            return;
        }
        //Set speed according to curl
        if (stone.velocityX < 0) {
            stone.velocityX = -1 * (velocityVector * Math.cos(angle));
        }
        else {
            stone.velocityX = velocityVector * Math.cos(angle);
        }
        stone.velocityZ = velocityVector * Math.sin(angle);
    }
    //Friction calculations end here

    //Collision calculations begin here
    collide(movingStone: Stone, notMovingStone: Stone) {
        let dx = notMovingStone.positionX - movingStone.positionX;
        let dz = notMovingStone.positionZ - movingStone.positionZ;
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));
        let angle = Math.acos(dx / distance);


        let velocityXAlongAxis = movingStone.velocityX * Math.cos(angle);
        let velocityZAlongAxis = movingStone.velocityZ * Math.sin(angle);
        let velocityTotalAlongAxis = velocityXAlongAxis + velocityZAlongAxis;

        notMovingStone.velocityX = velocityTotalAlongAxis * Math.cos(angle);
        notMovingStone.velocityZ = velocityTotalAlongAxis * Math.sin(angle);

        let remainingVelocityX = Math.abs(movingStone.velocityX) - Math.abs(velocityXAlongAxis);
        if (remainingVelocityX > 0 && movingStone.velocityX < 0) {
            remainingVelocityX *= -1;
        }
        let remainingVelocityZ = movingStone.velocityZ - velocityZAlongAxis;

        movingStone.velocityX = remainingVelocityX;
        movingStone.velocityZ = remainingVelocityZ;
    }
    //Collision calculations end here
}
