import { Injectable } from '@angular/core';

@Injectable()
export class CameraService {


    public camera: THREE.PerspectiveCamera;

    public isTopPositionCamera: boolean;
    public isPerspectivePositionCamera: boolean;
    public isStartingPosition = true;
    public cameraHasArrived = false;

    constructor(private perspCamera: THREE.PerspectiveCamera) {
        this.camera = perspCamera;
    }
    //-----------------------changement de camera---------------------------------

    //Possibilité de changer de caméra en tout temps
    changeCamera(): void {
        //this.camera = new THREE.PerspectiveCamera(100, 0.8, 1, 5000);
        if (this.isTopPositionCamera === true) {
            console.log("perspective camera set");
            this.setPerspectivePositionCam();
            this.isTopPositionCamera = false;
        }
        else {
            console.log("top camera set");
            this.setTopPositionCam();
            this.isPerspectivePositionCamera = false;
        }
    }

    moveCamStone(position: number[]) {
        this.isStartingPosition = false;
        if (!this.isTopPositionCamera) {
            if (this.camera.position.z > -200 && !this.isTopPositionCamera) {
                this.camera.position.z = position[2] + 50;
                this.camera.position.y = position[1];
                this.camera.position.x = position[0];
                this.camera.lookAt(new THREE.Vector3(0, 30, position[2]));
            }
        } else {
            this.setTopPositionCam();
        }
    }

    public animateGoBackCamera(deltaT: number): void {
        if (this.camera.position.z < 380 && this.cameraHasArrived) {
            this.camera.position.z += deltaT * 170;
            this.camera.position.y -= deltaT * 10;
            this.camera.lookAt(new THREE.Vector3(0, -100, -460));
        }
    }

    // position initiale de la camera
    public setStartingPositionCam(): void {
        this.camera = new THREE.PerspectiveCamera(100, 0.8, 1, 5000);
        this.camera.position.set(0, 80, 220);
        this.camera.lookAt(new THREE.Vector3(0, 30, -300));
    }

    public setTopPositionCam(): void {
        this.camera.position.set(0, 280, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.isTopPositionCamera = true;
    }

    public setPerspectivePositionCam(): void {
        if (this.isStartingPosition) {
            this.setStartingPositionCam();
        }
        else {

            this.camera.position.set(0, this.camera.position.y, this.camera.position.z);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.isPerspectivePositionCamera = true;

        }
    }

    public translateCamera(x: number, y: number, z: number): void {
        this.camera.position.x += x === undefined ? 0 : x;
        this.camera.position.y += y === undefined ? 0 : y;
        this.camera.position.z += z === undefined ? 0 : z;
        this.camera.updateProjectionMatrix();
    }
}

