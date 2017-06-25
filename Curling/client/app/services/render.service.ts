import { Injectable } from '@angular/core';
//import { ObjectCreaterService } from './object-creater.service';
//import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
//import { HttpModule } from '@angular/http';
import { PhysicsService, Spin, Sweep } from './physics.service';
import { Stone } from '../classes/stone';
import { HeadUpService, Difficulty } from './hud.service';
import { CameraService } from './camera.service';
import { HardAIService } from './hardai.service';
import { LeaderboardService } from './leaderboard.service';
import { MdDialog } from '@angular/material';
import { LeaderboardComponent } from '../components/leaderboard.component';

enum limit {
    x = 28,
    z = -320
}

enum centerHouse {
    x = 0,
    z = -260
}

export enum radius {
    longer = 30
}

export enum StartingPosition {
    x = 0,
    z = -120
}

interface StateMachineFlags {
    canPlay: boolean;
    isPlayerUser: boolean;
    isUserSetAction: boolean;
    isStoneUserPlaced: boolean;
    isStoneAIPlaced: boolean;
    aisetAction: boolean;
    start: boolean;
    victory: boolean;
}

export const MAXVELOCITY = 90;
const START = 145;
const ANGLE = 0.03;
const MAXUSERANGLE = Math.PI / 6; //30 degrees

@Injectable()
export class RenderService {

    private scene: THREE.Scene = new THREE.Scene();
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.Geometry;
    private material: THREE.MeshBasicMaterial;
    private mesh: THREE.Mesh;
    public headUpService: HeadUpService;
    public cameraService: CameraService;
    private headUpScene: THREE.Scene;
    private headUpCamera: THREE.OrthographicCamera;
    private arena: THREE.Mesh;
    private end = false;
    private dialog: MdDialog;

    /* __________________________  Illumination  __________________________*/
    private illuminationArray: THREE.Mesh[] = [];
    private distanceArray: number[] = [];
    private confettiArray: THREE.Mesh[] = [];
    private stonesGivenPointsArray: boolean[] = [];
    /* __________________________  score  __________________________*/
    private scoreGreen = 0;
    private scoreRed = 0;
    /* _________________________  balai _________________________________*/
    private broomGreen: THREE.Mesh;
    private broomRed: THREE.Mesh;
    private usingBroom: boolean;
    /* ____________________________________________________________________*/

    private useAngle: boolean;
    private wf: boolean;
    private clock: THREE.Clock;
    private dt: number;
    private arrowDirection: THREE.ArrowHelper;
    private xPositionCam = 0;
    private collisionSound: HTMLAudioElement;
    private stoneArray: THREE.Mesh[] = [];
    private stoneDescArray: Stone[] = [];
    private stoneWinIndicator: THREE.Mesh[] = [];
    private stateMachine: StateMachineFlags;
    private indexStonePlayer = 0;
    private indexStoneAi = 8;
    private compteur = 0;
    private manche = 1;
    private level = 0;
    private winner = 'null';
    private passToNextRound = false;


    constructor(private physics: PhysicsService, private hardAI: HardAIService, private lbServ: LeaderboardService) {
        this.initStonesDesc();
        this.headUpService = new HeadUpService(this.headUpCamera);
        this.cameraService = new CameraService(this.camera);
        this.initState();
    }

    private initState() {
        this.stateMachine = ({
            canPlay: false,
            isPlayerUser: true,
            isUserSetAction: false,
            isStoneUserPlaced: false,
            isStoneAIPlaced: false,
            aisetAction: false,
            start: false,
            victory: false
        });
    }



    private getVelocityModule(stone: Stone): number {
        return Math.pow(stone.velocityX, 2)
            + Math.pow(stone.velocityZ, 2);
    }

    initStonesDesc() {
        for (let i = 0; i < 16; i++) {
            this.stoneDescArray.push({ positionX: 0, positionZ: 0, velocityX: 0, velocityZ: 0, spin: Spin.none });
        }
    }

    animate(): void {
        window.requestAnimationFrame(_ => this.animate());
        if (!this.stateMachine.victory) {
            this.dt = this.clock.getDelta();
            this.headUpService.rotateSpinImage();
            if (this.stateMachine.isUserSetAction && this.stateMachine.isPlayerUser) {
                this.broomGreen.visible = true;
                this.broomRed.visible = false;
                this.arrowDirection.visible = false;
            } else if (!this.stateMachine.isUserSetAction && this.stateMachine.isPlayerUser) {
                this.broomGreen.visible = false;
                this.broomRed.visible = true;
                this.broomRed.position.x = 0;
                this.broomRed.position.y = 5;
                this.broomRed.position.z = START - 21;
                this.arrowDirection.visible = true;
            }

            if (this.compteur <= 16 && this.stateMachine.canPlay && this.manche < 4) {
                this.playGameState();
            }
            if (this.compteur > 16 && this.passToNextRound) {
                this.roundFinishState();
                this.passToNextRound = false;
                this.cameraService.setStartingPositionCam();
                this.cameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));
            }
            if (this.compteur > 16 && !this.passToNextRound) {
                this.cameraService.camera.position.x = 0;
                this.cameraService.camera.position.y = 50;
                this.cameraService.camera.position.z = -200;
                this.cameraService.camera.lookAt(new THREE.Vector3(0, 0, -600));
                this.headUpService.disableSpinSelector();
            }
        } else {
            if (!this.end) {
                this.winner = this.getWinner();
                if (this.winner === 'green') {
                    let greenStone: THREE.Mesh = this.createObject3d('PierreVert.dae', 0, 5, START);
                    greenStone.scale.y = 1.7;
                    this.stoneArray.push(greenStone);
                    this.scene.add(this.stoneArray[0]);
                } else if (this.winner === 'red') {
                    let red: THREE.Mesh = this.createObject3d('PierreRouge.dae', 0, 5, START);
                    red.scale.y = 1.7;
                    this.stoneArray.push(red);
                    this.scene.add(this.stoneArray[0]);
                }
                this.headUpService.disableSpinSelector();
                this.end = true;
            }
            this.animateConfetti(this.dt);
        }
        this.render();
    }

    public setNextRoud() {
        this.passToNextRound = true;
    }

    private roundFinishState() {
        this.PointingRound();
        this.headUpService.setScore(this.scoreGreen, this.scoreRed);
        this.manche++;
        this.headUpService.roundScore[this.manche - 1].visible = true;
        this.headUpService.roundScore[this.manche - 2].visible = false;
        if (this.manche < 4) {
            this.headUpService.sethandleGame(this.manche);
            if (this.scoreGreen >= this.scoreRed) {
                this.stateMachine.isPlayerUser = true;
                this.stateMachine.isUserSetAction = false;
            } else {
                this.stateMachine.isPlayerUser = false;
                this.stateMachine.isUserSetAction = false;
            }
        }
        else {
            this.headUpService.setCongratulationMessage(this.getWinner());
            this.stateMachine.victory = true;
        }
        this.headUpService.setScore(this.scoreGreen, this.scoreRed);
        this.miniSetUp();
        this.compteur = 0;
    }


    private playGameState() {
        this.isAllStoneStopped();
        if (this.stateMachine.isPlayerUser && !this.stateMachine.isStoneUserPlaced) {
            this.placeUserStone();
        }
        if (!this.stateMachine.isPlayerUser && !this.stateMachine.isStoneAIPlaced) {
            this.placeAIStone();
        }
        if (!this.stateMachine.isPlayerUser) {
            this.broomGreen.visible = false;
            this.broomRed.visible = false;
        }
        if (this.stateMachine.isPlayerUser && this.stateMachine.isUserSetAction) {
            this.moveStones(this.dt);
        } else if (!this.stateMachine.isPlayerUser && this.stateMachine.aisetAction) {
            this.moveStones(this.dt);
        }
    }

    private placeUserStone() {
        console.log("User turn ");
        this.compteur++;
        this.stoneArray[this.indexStonePlayer].position.x = 0;
        this.scene.add(this.stoneArray[this.indexStonePlayer]);
        this.stateMachine.isStoneUserPlaced = true;
    }
    private placeAIStone() {
        console.log("Machine turn ");
        this.compteur++;
        this.stoneArray[this.indexStoneAi].position.x = 0;
        this.scene.add(this.stoneArray[this.indexStoneAi]);
        this.aiCalcul();
        this.headUpService.disableSpinSelector();
        this.stateMachine.isStoneAIPlaced = true;
    }

    private miniSetUp() {
        for (let i = 0; i < this.stoneArray.length; i++) {
            this.scene.remove(this.stoneArray[i]);
        }
        for (let i = 0; i < this.stoneWinIndicator.length; i++) {
            this.scene.remove(this.stoneWinIndicator[i]);
        }
        this.stoneArray = [];
        this.stoneDescArray = [];
        this.initStonesDesc();
        this.createStones();
        this.indexStoneAi = 8;
        this.indexStonePlayer = 0;
        this.stateMachine.isStoneUserPlaced = false;
        this.stateMachine.isStoneAIPlaced = false;
        this.headUpService.headUpScene.remove(this.headUpService.stoneReminingPlayer);
        this.headUpService.headUpScene.remove(this.headUpService.stoneReminingAi);
        this.headUpService.setReminingStonesAi(8);
        this.headUpService.setReminingStonesPlayer(8);
    }

    private isAllStoneStopped(): boolean {
        let valueToReturn = true;
        for (let i = 0; i < this.stoneDescArray.length; i++) {
            if (this.getVelocityModule(this.stoneDescArray[i]) > 0) {
                valueToReturn = false;
            }
        }

        if (valueToReturn && (this.stateMachine.aisetAction || this.stateMachine.isUserSetAction)) {
            this.cameraService.setStartingPositionCam();
            this.xPositionCam = 0;
            if (this.stateMachine.isPlayerUser) {
                this.stateMachine.isPlayerUser = false;
                this.stateMachine.isStoneAIPlaced = false;
                this.stateMachine.isUserSetAction = false;
                this.indexStonePlayer++;
                this.headUpService.headUpScene.remove(this.headUpService.stoneReminingPlayer);
                this.headUpService.setReminingStonesPlayer(8 - this.indexStonePlayer);
            } else {
                this.stateMachine.isPlayerUser = true;
                this.stateMachine.isStoneUserPlaced = false;
                this.stateMachine.aisetAction = false;
                this.indexStoneAi++;
                this.headUpService.enableSpinSelector();
                this.headUpService.enableSpeedSelector();
                this.headUpService.headUpScene.remove(this.headUpService.stoneReminingAi);
                this.headUpService.setReminingStonesAi(16 - this.indexStoneAi);
            }
        }
        return valueToReturn;
    }

    private aiCalcul(): void {
        switch (this.level) {
            case Difficulty.easy:

                let direction = this.getRandomDirection();
                let angle = this.getRandomAngle();
                let speedAI = this.getRandomSpeed(MAXVELOCITY * 0.62, MAXVELOCITY * 0.58);
                this.stoneDescArray[this.indexStoneAi].velocityX = Math.sin(angle) * direction * speedAI;
                this.stoneDescArray[this.indexStoneAi].velocityZ = Math.cos(angle) * speedAI;
                this.stateMachine.aisetAction = true;
                break;
            case Difficulty.hard:

                let index = -1;
                for (let i = 0; i < 8; i++) {
                    if (this.isInHouse(i)) {
                        index = i;
                        i = 8;
                    }
                }
                if (index > -1) {
                    let speedAI2 = this.hardAI.hitStone(this.stoneDescArray[index]);
                    this.stoneDescArray[this.indexStoneAi].velocityX = speedAI2[0];
                    this.stoneDescArray[this.indexStoneAi].velocityZ = speedAI2[1];
                    this.stateMachine.aisetAction = true;
                } else {
                    let speed = this.hardAI.velocityToHome();
                    this.stoneDescArray[this.indexStoneAi].velocityX = speed[0];
                    this.stoneDescArray[this.indexStoneAi].velocityZ = speed[1];
                    this.stateMachine.aisetAction = true;
                }
                break;
            default:
                break;

        }
    }

    private getRandomAngle(): number {
        return (Math.random() * (ANGLE));
    }

    private getRandomDirection(): number {
        let directionSigne = Math.random() >= 0.5 ? 1 : -1;
        return directionSigne;
    }

    private getRandomSpeed(max: number, min: number): number {
        return (Math.random() * (max - min) + min);
    }

    private moveStones(deltaT: number) {
        //this.checkOutOfBounds();
        this.moveObjectAnimation(deltaT);
        let index = this.stateMachine.isPlayerUser ? this.indexStonePlayer : this.indexStoneAi;
        if (this.stoneArray[index].position.z < (-1 * START) + 40) {
            let tempPosition = [this.xPositionCam / 7, this.stoneArray[index].position.y +
                40 + this.xPositionCam * 0.4, this.stoneArray[index].position.z];
            this.detectCollision();
            this.xPositionCam++;
            this.cameraService.moveCamStone(tempPosition);
            this.broomGreen.visible = false;
            if (this.stateMachine.isUserSetAction) {
                this.broomRed.visible = true;
            }
        } else {
            let tempPosition = [0, this.stoneArray[index].position.y + 40, this.stoneArray[index].position.z];
            this.cameraService.moveCamStone(tempPosition);
            this.broomRed.position.z = tempPosition[2] - 20;
            this.broomGreen.position.z = tempPosition[2] - 20;
            if (this.usingBroom) {
                this.animateBroom(index);
            } else {
                this.broomGreen.position.x = this.stoneArray[index].position.x;
                this.broomRed.position.x = this.stoneArray[index].position.x;
            }
        }
    }

    private moveObjectAnimation(deltaT: number) {
        for (let i = 0; i < this.stoneArray.length; i++) {
            let stoneIndex = this.stoneArray[i];
            if (this.isWinnerStone(i)) {
                this.stoneWinIndicator[i].position.x = stoneIndex.position.x;
                this.stoneWinIndicator[i].position.z = stoneIndex.position.z;
                this.scene.add(this.stoneWinIndicator[i]);
            } else {
                this.scene.remove(this.stoneWinIndicator[i]);
            }
            let currentSpeed = this.getVelocityModule(this.stoneDescArray[i]);
            if (currentSpeed > 0) {
                if (Math.abs(this.stoneArray[i].position.x) < limit.x &&
                    this.stoneArray[i].position.z > limit.z) {
                    this.translateObject(i, deltaT);
                } else {
                    this.removeObject(i);
                }
            } else if (this.stoneArray[i].position.x !== Infinity) {
                this.checkOutOfBounds(i);
            }
        }
    }

    private translateObject(i: number, deltaT: number) {
        this.stoneArray[i].position.z -= deltaT * this.stoneDescArray[i].velocityZ;
        this.stoneArray[i].position.x += deltaT * this.stoneDescArray[i].velocityX;
        this.stoneDescArray[i].positionX = this.stoneArray[i].position.x;
        this.stoneDescArray[i].positionZ = this.stoneArray[i].position.z;
        this.physics.updateStoneVelocity(this.stoneDescArray[i], deltaT);
        if (this.stateMachine.isPlayerUser) {
            if (this.headUpService.leftSpinSelected) {
                this.stoneDescArray[i].spin = Spin.left;
                this.stoneArray[i].rotateY(deltaT);
                this.physics.curlStone(this.stoneDescArray[i]);
            }
            else if (this.headUpService.rightSpinSelected) {
                this.stoneDescArray[i].spin = Spin.right;
                this.stoneArray[i].rotateY(-deltaT);
                this.physics.curlStone(this.stoneDescArray[i]);
            }
        }
    }

    private removeObject(i: number) {
        this.scene.remove(this.stoneArray[i]);
        this.stoneArray[i].position.z = Infinity;
        this.stoneArray[i].position.x = Infinity;
        this.stoneDescArray[i].positionX = this.stoneArray[i].position.z;
        this.stoneDescArray[i].positionZ = this.stoneArray[i].position.x;
        this.stoneDescArray[i].velocityX = 0;
        this.stoneDescArray[i].velocityZ = 0;
    }

    private checkOutOfBounds(i: number) {
        if (!(Math.abs(this.stoneArray[i].position.x) < limit.x &&
            this.stoneArray[i].position.z > limit.z && this.stoneArray[i].position.z < -140)) {
            this.scene.remove(this.stoneArray[i]);
            this.stoneArray[i].position.z = Infinity;
            this.stoneArray[i].position.x = Infinity;
            this.stoneDescArray[i].positionX = this.stoneArray[i].position.z;
            this.stoneDescArray[i].positionZ = this.stoneArray[i].position.x;
            this.stoneDescArray[i].velocityX = 0;
            this.stoneDescArray[i].velocityZ = 0;
        }
    }

    private detectCollision() {
        let changed: number[] = [];
        for (let i = 0; i < this.stoneDescArray.length; i++) {
            let velocity = this.getVelocityModule(this.stoneDescArray[i]);
            if (velocity > 0 && !this.findElement(changed, i)) {
                for (let j = 0; j < 16; j++) {
                    if (i !== j && !this.findElement(changed, j)) {
                        if (this.isDistanceCollision(i, j)) {
                            changed.push(i);
                            changed.push(j);
                        }
                    }
                }
            }
        }
    }

    private findElement(array: number[], value: number): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }

    private animateBroom(index: number): void {
        this.physics.sweepTheIce(Sweep.easy);
        for (let i = 0; i < 200; i++) {
            this.broomGreen.position.x = this.stoneArray[index].position.x + 1.5;
        }
        for (let i = 0; i < 200; i++) {
            this.broomGreen.position.x = this.stoneArray[index].position.x - 1.5;
        }
        setTimeout(() => {
            this.physics.sweepTheIce(Sweep.none);
        }, 500);
    }


    private isDistanceCollision(i: number, j: number) {
        let deltaX = this.stoneArray[i].position.x - this.stoneArray[j].position.x;
        let deltaY = this.stoneArray[i].position.z - this.stoneArray[j].position.z;
        let distance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        distance = Math.sqrt(distance);
        if (distance < 9.3) {
            this.collisionSound.play();
            this.physics.collide(this.stoneDescArray[i], this.stoneDescArray[j]);
            return true;
        }
        return false;
    }

    setSpeed() {
        if (this.stateMachine.isPlayerUser) {
            console.log('Starting');
            let speedModule = this.headUpService.getSpeedSelectorValue() * MAXVELOCITY;
            this.stoneDescArray[this.indexStonePlayer].velocityX =
                -1 * (speedModule * Math.sin(this.arrowDirection.rotation.y));
            this.stoneDescArray[this.indexStonePlayer].velocityZ =
                speedModule * Math.cos(this.arrowDirection.rotation.y);
            this.stateMachine.isUserSetAction = true;
            this.stateMachine.start = true;
            this.headUpService.disableSpinSelector();
        }
    }

    public print(): void {
        console.log(this);
    }

    setLightScene(positionX: number, positionY: number,
        positionZ: number, ambientLight: number, directionLight: number): void {
        let ambientLightScene = new THREE.AmbientLight(ambientLight);
        ambientLightScene.intensity = 0.6;
        //ambientLightScene.sha
        this.scene.add(ambientLightScene);

        // ajout du spotlight
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(100, 1000, 100);
        spotLight.castShadow = true;
        spotLight.shadowCameraFar = 400;
        spotLight.shadowCameraFov = 30;
        spotLight.shadowCameraNear = 150;
        spotLight.intensity = 0.3;
        this.scene.add(spotLight);
    }
    /* _________________________________________ Creer les objets _________________________________________*/

    public createObject3d(path: string, positionX: number, positionY: number, positionZ: number): any {
        let obj = new THREE.Mesh;
        let s = new THREE.Object3D;
        let sceneObject = new THREE.ColladaLoader();
        sceneObject.load('/assets/models/' + path, (result) => {
            s = result.scene as THREE.Object3D;
            s.scale.set(45, 45, 45);
            (s as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                wireframe: false,
                shininess: 0.2,
            });
            obj.add(s);
        });
        obj.position.set(positionX, positionY, positionZ);
        return obj;
    }


    getClock(): number {
        return this.clock.getDelta();
    }

    public createSkybox(fileNameRight: string, fileNameLeft: string,
        fileNameTop: string, fileNameDown: string, fileNameBack: string, fileNameFront: string) {
        // ajouter les images pour creer la scene
        let materials: any[] = [
            this.createMaterials('../assets/images/' + fileNameRight),
            this.createMaterials('../assets/images/' + fileNameLeft),
            this.createMaterials('../assets/images/' + fileNameTop),
            this.createMaterials('../assets/images/' + fileNameDown),
            this.createMaterials('../assets/images/' + fileNameBack),
            this.createMaterials('../assets/images/' + fileNameFront),
        ];

        // creer un large cube pour le perimetre 3D de la scene de dimension 700 par 700 par 2500
        // meshFaceMaterial : Mapper toutes le material vers la face de la boite
        this.geometry = new THREE.BoxGeometry(2700, 2200, 2200, 1, 1, 1);
        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshFaceMaterial(materials));
        // ajuster l'hometesie de l'axe des x a -1,
        //pour mettre le cube a l'envers -> pour que les images soient visibles de l'interieur
        this.mesh.scale.set(-1, 1, 1);
        // ajouter l'objet aux objets de la scene
        this.scene.add(this.mesh);
    }

    private createArrowHelper() {
        this.arrowDirection = this.createObject3d('Flechedirection.dae', 0, 5, START - 21);
        this.arrowDirection.scale.x = 0.03;
        this.arrowDirection.scale.z = 0.08;
        this.scene.add(this.arrowDirection);
    }

    animateArrow(move: number): void {
        this.arrowDirection.translateZ(20);
        this.arrowDirection.rotation.y += (Math.PI / 2 * move) / 5;
        this.arrowDirection.translateZ(-20);
    }

    //---------------------fonction deja donnee----------------------
    private createMaterials(path: string) {
        // charger le lien
        let texture = THREE.ImageUtils.loadTexture(path);
        // creer l'objet
        let material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        return material;
    }

    public translateMesh(x: number, y: number): void {
        this.mesh.position.x += x;
        this.mesh.position.y += y;
    }

    onWindowResize() {
        let factor = 0.8;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this.cameraService.camera.aspect = newWidth / newHeight;
        this.cameraService.camera.updateProjectionMatrix();
        this.headUpService.headUpCamera =
            new THREE.OrthographicCamera(-newWidth / 2, newWidth / 2, newHeight / 2, -newHeight / 2, 0, 30);
        this.headUpService.headUpCamera.updateMatrix();
        this.renderer.setSize(newWidth, newHeight);
    }

    // superpose 2 scences l'une par dessus l'autre
    render(): void {
        //this.renderer.autoClear = false;
        this.renderer.clear();
        this.renderer.render(this.scene, this.cameraService.camera);
        this.renderer.clearDepth();
        this.renderer.render(this.headUpService.headUpScene, this.headUpService.headUpCamera);
    }

    toggleWireFrame(): void {
        this.wf = !this.wf;
        this.material.wireframe = this.wf;
        this.material.needsUpdate = true;
    }


    onResize() {
        const width = window.innerWidth * 0.95;
        const height = window.innerHeight - 90;
        this.cameraService.camera.aspect = width / height;
        //this.camera.updateProjectionMatrix();
        //this.headUpCamera.updateProjectionMAtrix();
        this.headUpService.headUpCamera =
            new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
        this.renderer.setSize(width, height);
    }

    public init(container: HTMLElement) {

        this.useAngle = false;
        this.clock = new THREE.Clock();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true, devicePixelRatio: window.devicePixelRatio, preserveDrawingBuffer: false
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight, true);
        this.renderer.autoClear = false;

        // positionner la camera
        this.cameraService.setStartingPositionCam();
        this.cameraService.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.cameraService.setStartingPositionCam();

        this.setLightScene(0, 2000, 0, 0x888888, 0xBBBBBB);
        this.setLightScene(0, 1000, -300, 0x888888, 0xBBBBBB);

        // la scene
        this.createSkybox(
            "iceflow_rt.png", "iceflow_lf.png", "iceflow_up.png", "iceflow_dn.png", "iceflow_bk.png", "iceflow_ft.png");
        this.arena = this.createObject3d('arena.dae', 0, 0, 0);
        //this.reflexionCamera.updateCubeMap ()
        this.scene.add(this.arena);

        /////////////////////////////// Objects 3D ////////////////////
        this.createStones();


        //draw Vector
        this.createArrowHelper();
        this.scene.add(this.arrowDirection);

        ///////////////////////////////  HEAD-UP scene ////////////////
        this.headUpScene = new THREE.Scene();

        this.setupFSMState();

        //Listeners for mouse click and move to implement Click and Hovering features
        this.renderer.domElement.addEventListener('mousemove', (e) => { this.onMouseMoveEvent(e); }, false);
        this.renderer.domElement.addEventListener('click', (e) => { this.onMouseClickEvent(e); }, false);
        this.renderer.domElement.addEventListener('mousedown', (e) => { this.onMouseDownEvent(e); }, false);
        window.addEventListener('mouseup', (e) => { this.onMouseUpEvent(e); }, false);


        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this.renderer.domElement);
        }

        for (let i = 0; i < 8; i++) {
            let illumination: THREE.Mesh = this.createObject3d('IlluminationVert.dae', Infinity, 7, START);
            illumination.scale.x = 0.125;
            illumination.scale.z = 0.125;
            this.stoneWinIndicator.push(illumination);
        }

        for (let i = 0; i < 8; i++) {
            let illumination: THREE.Mesh = this.createObject3d('IlluminationRouge.dae', Infinity, 7, START);
            illumination.scale.x = 0.125;
            illumination.scale.z = 0.125;
            this.stoneWinIndicator.push(illumination);
        }

        this.createConfetti();

        this.collisionSound = new Audio();
        this.collisionSound.src = '../assets/sound/collision.mp3';
        this.collisionSound.load();

        this.broomGreen = this.createObject3d('batonVert.dae', 0, 5, START - 21);
        this.broomGreen.scale.set(0.15, 0.15, 0.15);
        this.broomGreen.rotateY(80.1);
        this.broomGreen.rotateZ(91);
        this.scene.add(this.broomGreen);
        this.broomGreen.visible = false;

        this.broomRed = this.createObject3d('batonRouge.dae', 0, 5, START - 21);
        this.broomRed.scale.set(0.15, 0.15, 0.15);
        this.broomRed.rotateY(80.1);
        this.broomRed.rotateZ(91);
        this.scene.add(this.broomRed);
        this.broomRed.visible = false;


        this.clock.start();
        this.animate();

        window.addEventListener('resize', _ => this.onResize());
    }

    createStones() {
        // pierre de curling
        for (let i = 0; i < 8; i++) {
            let greenStone: THREE.Mesh = this.createObject3d('PierreVert.dae', Infinity, 5, START);
            greenStone.scale.y = 1.7;
            this.stoneArray.push(greenStone);
        }

        for (let i = 0; i < 8; i++) {
            let redStone = this.createObject3d('PierreRouge.dae', Infinity, 5, START);
            redStone.scale.y = 1.7;
            this.stoneArray.push(redStone);
        }
    }

    private setupFSMState() {
        this.headUpService.initializeHUD();
        this.headUpService.gameDifficultySetup();
    }

    private onMouseDownEvent(e: any) {
        if (this.headUpService.isSettingVelocity) {
            this.headUpService.selectVelocity();
        } else if (this.broomGreen.visible) {
            this.usingBroom = true;
        }
    }


    private onMouseUpEvent(e: any) {
        if (this.headUpService.isSettingVelocity
            && this.headUpService.isAtMinimumVelocity()) {
            this.setSpeed();
        }
        this.usingBroom = false;

    }

    private onMouseMoveEvent(e: any) {
        if (this.headUpService.isSelectingDifficulty === true) {
            let middle = Math.floor(this.renderer.getSize().width / 2);
            if (e.layerX < middle) {
                this.headUpService.hoverDifficulty(Difficulty.easy);
            } else if (e.layerX > middle) {
                this.headUpService.hoverDifficulty(Difficulty.hard);
            }
        } else if (this.stateMachine.isPlayerUser) {
            let middle = Math.floor(this.renderer.getSize().width / 2);
            let height = this.renderer.getSize().height;

            let deltaY = height - e.layerY;
            let deltaX = e.layerX - middle;
            let angle = Math.atan(deltaX / deltaY);
            if (Math.abs(angle) < MAXUSERANGLE) {
                this.arrowDirection.translateZ(20);
                this.arrowDirection.rotation.y = -angle;
                this.arrowDirection.translateZ(-20);
            }

        }
    }

    private onMouseClickEvent(e: any) {
        if (this.headUpService.isSelectingDifficulty === true) {
            let middle = Math.floor(this.renderer.getSize().width / 2);
            //Easy on the left, hard on the right
            if (e.layerX < middle) {
                this.headUpService.selectDifficulty(Difficulty.easy);
                this.level = Difficulty.easy;
                this.stateMachine.canPlay = true;
                this.stateMachine.isUserSetAction = false;
            } else if (e.layerX > middle) {
                this.headUpService.selectDifficulty(Difficulty.hard);
                this.level = Difficulty.hard;
                this.stateMachine.canPlay = true;
                this.stateMachine.isUserSetAction = false;
            }
        } else if (this.headUpService.isSelectingSpin === true) {
            this.headUpService.onMouseClick(e);
            this.headUpService.intersectObject();
        }
    }

    private distanceWithHouse(index: number): number {
        let deltaX = this.stoneArray[index].position.x - centerHouse.x;
        let deltaY = this.stoneArray[index].position.z - centerHouse.z;
        let distance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        distance = Math.sqrt(distance);
        return distance;
    }

    private isInHouse(index: number): boolean {
        if (this.distanceWithHouse(index) < radius.longer) {
            return true;
        }
        return false;
    }

    private initializeDistanceArray(): void {
        for (let i = 0; i < this.stoneArray.length; i++) {
            if (this.isInHouse(i) === true) {
                this.distanceArray[i] = this.distanceWithHouse(i);
            }
            else {
                this.distanceArray[i] = 260;
                this.scene.remove(this.illuminationArray[i]);
            }
        }
    }
    private calculNumberStoneInHouse(): number {
        let numberStoneInHouse = 0;
        for (let i = 0; i < this.stoneArray.length; i++) {
            if (this.isInHouse(i) === true) {
                numberStoneInHouse++;
            }
        }
        return numberStoneInHouse;
    }

    private getTeam(index: number): string {
        if (index < 8) {
            return 'green';
        }
        return 'red';
    }

    private createConfetti(): void {


        for (let j = 0; j < 17; j++) {
            for (let i = 0; i < 7; i++) {
                let index: number = i + j * 7;

                let geometry = new THREE.SphereGeometry(5, 32, 32);
                let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                let sphere = new THREE.Mesh(geometry, material);

                sphere.position.x = 12 * i - 36;
                sphere.position.z = -22 * j - 40;
                sphere.position.y = 300;

                sphere.scale.x = 0.5;
                sphere.scale.y = 0.5;
                sphere.scale.z = 0.5;

                this.confettiArray.push(sphere);
                this.scene.add(this.confettiArray[index]);
            }
        }
    }

    private animateConfetti(deltaT: number): void {

        for (let i = 0; i < this.confettiArray.length; i++) {

            if (this.confettiArray[i].position.y - deltaT * 30 > 7) {
                this.confettiArray[i].rotation.x -= (deltaT * 10 / 4);
                this.confettiArray[i].rotation.z += (deltaT * 10);
                this.confettiArray[i].position.y -= deltaT * 30;
            }
            else {
                this.confettiArray[i].rotation.x = 0;
                this.confettiArray[i].rotation.z = 0;
                this.confettiArray[i].position.y = 7;
                this.lbServ.postPlayerScore(this.headUpService.playerName,
                    this.level,
                    this.scoreGreen)
                    .then(() => {
                        this.dialog.open(LeaderboardComponent);
                    });
            }
        }

        this.stoneArray[0].position.y += 10 * deltaT;
    }

    private indexBestStone(): number {
        let bestStone: number = -1;
        let lessDistance = 50;
        for (let i = 0; i < this.stoneArray.length; i++) {
            if (lessDistance > this.distanceArray[i]) {
                bestStone = i;
                lessDistance = this.distanceArray[i];
            }

        }
        return bestStone;
    }

    private initializeStonesGivenPointsArray(): void {
        for (let i = 0; i < this.stoneArray.length; i++) {
            this.stonesGivenPointsArray[i] = false;
        }
    }

    private isWinnerStone(indexStone: number): boolean {
        this.initializeDistanceArray();
        this.initializeStonesGivenPointsArray();
        let numberStoneInHouse: number = this.calculNumberStoneInHouse();
        if (numberStoneInHouse > 0) {
            let bestStone: number = this.indexBestStone();
            let winner: string = this.getTeam(bestStone);
            do {
                bestStone = this.indexBestStone();
                if (bestStone !== -1 && winner === this.getTeam(bestStone)) {
                    this.stonesGivenPointsArray[bestStone] = true;
                    this.distanceArray[bestStone] = 260;
                    numberStoneInHouse--;
                }
                else {
                    numberStoneInHouse = 0;
                }
            }
            while (numberStoneInHouse > 0);
        }
        return this.stonesGivenPointsArray[indexStone];
    }

    private PointingRound(): void {
        this.stonesWinnerRouand();
        for (let i = 0; i < 16; i++) {
            console.log('Pierre [' + i + '] = ' + this.stonesGivenPointsArray[i]);

        }
        console.log('Vert ' + this.scoreGreen + ' | ' + this.scoreRed + ' Rouge');
    }
    private upScore(winner: string): void {
        if (winner === "red") {
            this.scoreRed++;
            console.log('Le rouge marque une point');
        }
        else {
            this.scoreGreen++;
            console.log('Le vert marque une point');
        }
    }
    private stonesWinnerRouand(): void {
        this.initializeDistanceArray();
        this.initializeStonesGivenPointsArray();
        let numberStoneInHouse: number = this.calculNumberStoneInHouse();
        console.log('Nombre pierre dans la maison : ' + numberStoneInHouse);
        if (numberStoneInHouse > 0) {
            let bestStone: number = this.indexBestStone();
            console.log('1 absolu Pierre[' + bestStone + ']');
            let winner: string = this.getTeam(bestStone);
            do {
                bestStone = this.indexBestStone();
                console.log('Meilleur Pierre[' + bestStone + ']');
                if (bestStone !== -1 && winner === this.getTeam(bestStone)) {
                    this.stonesGivenPointsArray[bestStone] = true;
                    this.upScore(winner);
                    this.distanceArray[bestStone] = 260;
                    numberStoneInHouse--;
                }
                else {
                    numberStoneInHouse = 0;
                }
            }
            while (numberStoneInHouse > 0);
        }
    }


    private getWinner(): string {
        if (this.scoreGreen > this.scoreRed) {
            return "green";
        } else if (this.scoreGreen < this.scoreRed) {
            return "red";
        } else {
            return "nul";
        }
    }

    public setUserName(name: string) {
        this.headUpService.playerName = name;
    }

    public setDialog(dialog: MdDialog) {
        this.dialog = dialog;
    }

}




