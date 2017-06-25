import { Injectable } from '@angular/core';

interface Textconfig {
    text: string;
    font: string;
    size: string;
    police: string;
    align: string;
    red: string;
    green: string;
    blue: string;
    alpha: string;
    x: number;
    y: number;
}

export enum Difficulty { easy = 0, hard = 1 }

const RECTANGLEHEIGHT = 300;
const RECTANGLEWIDTH = 50;


@Injectable()

export class HeadUpService {

    public headUpScene: THREE.Scene;
    public headUpCamera: THREE.OrthographicCamera;
    private headUpCanvas: any;
    private headerCanvas: any;
    private playerCanvas: any;

    // raycastervar raycaster = new THREE.Raycaster();
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector3();

    public isSelectingDifficulty: Boolean = false;
    private difficultyMessage: THREE.Mesh;
    private easyButton: THREE.Sprite;
    private easyButtonHover: THREE.Sprite;
    private hardButton: THREE.Sprite;
    private hardButtonHover: THREE.Sprite;

    public playerName: string;

    public roundScore: THREE.Mesh[] = [];
    ////////////// Spin
    public spinObj: THREE.Sprite;
    public leftSpinButton: THREE.Sprite;
    public rightSpinButton: THREE.Sprite;
    public goToDificultyButton: THREE.Sprite;
    public spinText: THREE.Sprite;
    public rightSpinSelected = false;
    public leftSpinSelected = false;
    public isSelectingSpin = false;

    /// score
    public stoneReminingPlayer: THREE.Mesh;
    public stoneReminingAi: THREE.Mesh;

    // help menu
    public helpButton: THREE.Sprite;
    private helpMenu: THREE.Sprite;
    public menuIsSet = false;

    public isSettingVelocity: Boolean = false;
    private speedSelectorOutter: THREE.Mesh = null;
    private speedSelectorInner: THREE.Mesh = null;
    private speedSelectorValue: number;
    private incrementValue: number;
    private incrementIntervalTimer: NodeJS.Timer;

    constructor(private hudCamera: THREE.OrthographicCamera) {
        this.headUpCamera = hudCamera;
    }

    //-----------------creation d'une nouvelle scene ( head-up display)-----------

    public setHeadUpCanvas(object: any): any {
        object = document.createElement('canvas');
        let width = window.innerWidth;
        let height = window.innerHeight;
        object.width = width;
        object.height = height;
        return object;
    }

    public setHeadUpCamera(): void {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.headUpCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
    }

    // ajustement de la fenetre
    public onResize(width: number, height: number) {
        width = window.innerWidth * 0.95;
        height = window.innerHeight - 90;
        this.headUpCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
    }

    public setHeadUpText(config: Textconfig, object1: any): any {
        let object;
        object = this.setHeadUpCanvas(object1);
        let width = window.innerWidth;
        let height = window.innerHeight;
        let hudBitmap = object.getContext('2d');
        hudBitmap.font = config.font + " " + config.size + " " + config.police;
        hudBitmap.textAlign = config.align;
        hudBitmap.fillStyle = "rgba(" + config.red + "," + config.green + "," + config.blue + "," + config.alpha + ")";
        hudBitmap.fillText(config.text, width / 2, height / 2);

        let hudTexture = new THREE.Texture(object);
        hudTexture.needsUpdate = true;
        let material = new THREE.MeshBasicMaterial({ map: hudTexture });
        material.transparent = true;

        let planeGeometry = new THREE.PlaneGeometry(width, height);
        let plane = new THREE.Mesh(planeGeometry, material);
        plane.position.x = config.x;
        plane.position.y = config.y;
        plane.position.z = 0;
        this.headUpScene.add(plane);
        return plane;
    }

    // cree des objets en apparence 2d pour le contenu de la fenetre de jeu
    public createImageObject(imageName: string,
        positionX: number,
        positionY: number,
        scaleX: number,
        scaleY: number): THREE.Sprite {

        // chargement, mapping et creation de l'image sprite
        let imageMap = new THREE.TextureLoader().load('../assets/images/' + imageName);
        let spriteMaterial = new THREE.SpriteMaterial({ map: imageMap, color: 0xffffff });
        let spriteImage = new THREE.Sprite(spriteMaterial);

        //set la position dans la fenetre
        spriteImage.position.x = positionX;
        spriteImage.position.y = positionY;
        spriteImage.castShadow = true;
        spriteImage.scale.set(scaleX, scaleY, 1);
        return spriteImage;
    }

    //////// help Menu ///////

    private createHelpButton() {
        this.helpButton = this.createImageObject("helpbtn.png", -650, -355, 90, 90);
        this.headUpScene.add(this.helpButton);
    }

    private setHelpMenu() {
        this.helpMenu = this.createImageObject("helpMenu.png", 100, 100, 1600, 800);
        this.headUpScene.add(this.helpMenu);
        this.helpMenu.visible = false;
    }

    public enableHelpMenu() {
        this.helpMenu.visible = true;
    }

    public disableHelpMenu() {
        this.helpMenu.visible = false;
    }


    private showInstructionText(bool: boolean) {
        let canv1;
        //let obj1, obj2, obj3;
        let constructor1: Textconfig = {
            text: "Appuyez sur (h) pour de l'aide",
            font: "Bold",
            size: "30px",
            police: "Arial",
            align: 'center',
            red: "139",
            green: "137",
            blue: "137",
            alpha: "1",
            x: -650,
            y: -300,
        };

        this.setHeadUpText(constructor1, canv1).visible = bool;
    }

    // cache les instructions de la fenetre
    public hideInstructionText() {
        this.showInstructionText(false);
    }

    public setPlayerName(name: string) {
        ////////////////////////////// player //////////////////////////
        let player: Textconfig = {
            text: name,
            font: "Bold",
            size: "30px",
            police: "Arial",
            align: 'left',

            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: -560 - (name.length - 1) * 7.5,
            y: 350,
        };
        this.setHeadUpText(player, this.playerCanvas);
    }

    public setCongratulationMessage(winner: string) {
        /* ________________________________  Congratulation Message  ________________________________  */
        let message = '';
        let lenger = 0;
        if (winner === 'green') {
            message = 'Félicitation tu as gagné';
        }
        else if (winner === 'red') {
            lenger = 80;
            message = "L'intelligence artificielle a gagné";
        } else {
            message = "La partie est nulle";
            let player: Textconfig = {
                text: message,
                font: "Bold",
                size: "30px",
                police: "Arial",
                align: 'left',

                red: "255",
                green: "255",
                blue: "255",
                alpha: "1",
                x: -150 - lenger,
                y: 180,
            };
            this.setHeadUpText(player, this.playerCanvas);
        }
    }

    public sethandleGame(set: number): void {

        this.headUpScene.add(this.createImageObject('SetCircle.png', -56 + (set - 1) * 60, 250, 55, 55));
    }

    public setPointing() {
        ////////////////////////////// player //////////////////////////
        let player: Textconfig = {
            text: 'Pointage',
            font: "Bold",
            size: "50px",
            police: "Arial",
            align: 'center',

            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: 0,
            y: 350,
        };
        this.setHeadUpText(player, this.playerCanvas);
    }
    public setScore(green: number, red: number) {
        ////////////////////////////// player //////////////////////////
        let score: Textconfig = {
            text: green + ' | ' + red,
            font: "Bold",
            size: "30px",
            police: "Arial",
            align: 'left',

            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: -25,
            y: 300,
        };
        this.roundScore.push(this.setHeadUpText(score, this.headerCanvas));
    }


    public setAiName(name: string) {
        ////////////////////////////// player //////////////////////////

        let length: number = name.length;
        let player: Textconfig = {
            text: name,
            font: "Bold",
            size: "30px",
            police: "Arial",
            align: 'right',
            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: 590 + length,
            y: 350,
        };
        this.setHeadUpText(player, this.playerCanvas);
    }


    public setReminingStonesPlayer(stonesCounter: number) {

        let stonesCounterText: Textconfig = {
            text: stonesCounter + " X ",
            font: "bold",
            size: "30px",
            police: "Arial",
            align: "right",
            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: -520,
            y: 235,
        };
        this.stoneReminingPlayer = this.setHeadUpText(stonesCounterText, this.headerCanvas);
    }

    public setReminingStonesAi(stonesCounter: number) {
        let stonesCounterText: Textconfig = {
            text: stonesCounter + " X ",
            font: "bold",
            size: "30px",
            police: "Arial",
            align: "left",
            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: 525,
            y: 235,
        };

        this.stoneReminingAi = this.setHeadUpText(stonesCounterText, this.headerCanvas);
    }

    public gameDifficultySetup() {
        let difficultyText: Textconfig = {
            text: "Choisissez votre niveau!",
            font: "bold",
            size: "80px",
            police: "Arial",
            align: "center",
            red: "255",
            green: "255",
            blue: "255",
            alpha: "1",
            x: 0,
            y: 260,
        };
        this.difficultyMessage = this.setHeadUpText(difficultyText, this.headerCanvas);
        this.createHardDifficultyButton();
        this.createEasyDifficultyButton();
        this.isSelectingDifficulty = true;
    }
    public disableDifficultyButtons() {
        this.easyButton.visible = false;
        this.hardButton.visible = false;
        this.easyButtonHover.visible = false;
        this.hardButtonHover.visible = false;
        this.difficultyMessage.visible = false;
    }


    public hoverDifficulty(diff: Difficulty) {
        if (diff === Difficulty.easy) {
            this.easyButtonHover.visible = true;
            this.easyButton.visible = false;

            this.hardButton.visible = true;
            this.hardButtonHover.visible = false;
        }
        else if (diff === Difficulty.hard) {
            this.hardButtonHover.visible = true;
            this.hardButton.visible = false;

            this.easyButton.visible = true;
            this.easyButtonHover.visible = false;
        }
    }
    public selectDifficulty(diff: Difficulty) {
        if (diff === Difficulty.easy) {
            this.setAiName("Wall-E");
        } else {
            this.setAiName("El Terminator");
        }
        this.goToGame();
    }
    public createHardDifficultyButton() {
        this.hardButton = this.createImageObject('Button_HARD.png', 400, 0, 200, 200);
        this.hardButtonHover = this.createImageObject('Button_HARD.png', 400, 0, 300, 300);
        this.hardButtonHover.visible = false;
        this.headUpScene.add(this.hardButton);
        this.headUpScene.add(this.hardButtonHover);
    }

    public createEasyDifficultyButton() {
        this.easyButton = this.createImageObject('Button_EASY.png', -400, 0, 200, 200);
        this.easyButtonHover = this.createImageObject('Button_EASY.png', -400, 0, 300, 300);
        this.easyButtonHover.visible = false;
        this.headUpScene.add(this.easyButton);
        this.headUpScene.add(this.easyButtonHover);
    }

    private goToGame() {
        this.disableDifficultyButtons();

        //Disables difficulty selection but keeps mouse events active (for other uses if need-be)
        //Will be deprecated if no other code uses mouseEvents

        this.isSelectingDifficulty = false;

        ///////////////////////////////////////// set menu //////////////////////////////////////
        //Pictures of remaining stones
        this.headUpScene.add(this.createImageObject('PierreRouge.png', 550, (window.outerHeight / 2) * 0.45, 50, 50));
        this.headUpScene.add(this.createImageObject('PierreVerte.png', -550, (window.outerHeight / 2) * 0.45, 50, 50));
        //this.headUpScene.add(this.createImageObject('Curling-Game.png', 0, 250, 400, 150));

        this.headUpScene.add(this.createImageObject('UserLogo.png', -550, 300, 50, 50));
        this.headUpScene.add(this.createImageObject('AiLogo.png', 550, 300, 50, 50));

        this.headUpScene.add(this.createImageObject('SetLogo.png', -56, 250, 50, 50));
        this.headUpScene.add(this.createImageObject('SetLogo.png', 4, 250, 50, 50));
        this.headUpScene.add(this.createImageObject('SetLogo.png', 64, 250, 50, 50));

        this.setPointing();
        this.setScore(0, 0);
        this.setPlayerName(this.playerName);
        this.sethandleGame(1);

        this.setReminingStonesAi(8);
        this.setReminingStonesPlayer(8);
        ///////////////////////////////////// spin  //////////////////////////////////////////
        this.spinObj = this.createSpinSelector();
        this.headUpScene.add(this.spinObj);

        this.rightSpinButton = this.createRightSpinButton(300, -200);
        this.headUpScene.add(this.rightSpinButton);
        this.leftSpinButton = this.createLeftSpinButton(-300, -200);
        this.headUpScene.add(this.leftSpinButton);
        this.createGoToDificultytButton();
        this.createSpinText();
        this.enableSpinSelector();

    }

    public enableSpeedSelector() {
        if (this.speedSelectorInner === null || this.speedSelectorOutter === null) {
            this.createSpeedSelector();
        }
        this.speedSelectorOutter.visible = true;
        this.speedSelectorInner.visible = true;
        this.speedSelectorValue = 1;
        this.incrementValue = 0.5;
        this.isSettingVelocity = true;
    }


    public selectVelocity() {
        this.incrementIntervalTimer = setInterval(() => { this.incrementSelector(); }, 10);
    }

    private stopSpeedAnimation() {
        //Stop animation
        clearInterval(this.incrementIntervalTimer);
        //Hide speed selector
        this.speedSelectorOutter.visible = false;
        this.speedSelectorInner.scale.y = 1;
        this.speedSelectorInner.visible = false;
        this.isSettingVelocity = false;
    }

    private incrementSelector() {
        if (this.speedSelectorValue === 100) {
            this.incrementValue = 0;
        }
        this.speedSelectorValue = this.speedSelectorValue + this.incrementValue;
        this.speedSelectorInner.scale.y = (this.speedSelectorValue / 100) * (RECTANGLEHEIGHT - 10);
    }

    public isAtMinimumVelocity(): boolean {
        // 30% de la force max est la vitesse minimale permise
        if (this.speedSelectorValue < 30) {
            this.stopSpeedAnimation();
            this.enableSpeedSelector();
            return false;
        }
        return true;
    }

    public getSpeedSelectorValue(): number {
        this.stopSpeedAnimation();
        return (this.speedSelectorValue / 100);
    }

    private createSpeedSelector() {
        let rectangleOutGeometry = new THREE.Geometry();
        rectangleOutGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        rectangleOutGeometry.vertices.push(new THREE.Vector3(0, RECTANGLEHEIGHT, 0));
        rectangleOutGeometry.vertices.push(new THREE.Vector3(RECTANGLEWIDTH, RECTANGLEHEIGHT, 0));
        rectangleOutGeometry.vertices.push(new THREE.Vector3(RECTANGLEWIDTH, 0, 0));
        rectangleOutGeometry.faces.push(new THREE.Face3(0, 1, 2));
        rectangleOutGeometry.faces.push(new THREE.Face3(0, 2, 3));

        let rectangleInGeometry = new THREE.Geometry();
        rectangleInGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        rectangleInGeometry.vertices.push(new THREE.Vector3(0, 1, 0));
        rectangleInGeometry.vertices.push(new THREE.Vector3(RECTANGLEWIDTH - 10, 1, 0));
        rectangleInGeometry.vertices.push(new THREE.Vector3(RECTANGLEWIDTH - 10, 0, 0));
        rectangleInGeometry.faces.push(new THREE.Face3(0, 1, 2));
        rectangleInGeometry.faces.push(new THREE.Face3(0, 2, 3));

        let frameMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        });
        let selectorMaterial = new THREE.MeshBasicMaterial({
            color: 0x00e04e,
            side: THREE.DoubleSide
        });

        this.speedSelectorOutter = new THREE.Mesh(rectangleOutGeometry, frameMaterial);
        this.speedSelectorInner = new THREE.Mesh(rectangleInGeometry, selectorMaterial);
        this.speedSelectorOutter.position.set(500, -300, 0);
        this.speedSelectorInner.position.set(505, -295, 0);
        this.headUpScene.add(this.speedSelectorOutter);
        this.headUpScene.add(this.speedSelectorInner);
    }

    public initializeHUD() {
        this.headUpScene = new THREE.Scene();
        this.setHeadUpCanvas(this.headUpCanvas);
        this.setHeadUpCamera();
        this.showInstructionText(true);
        this.createHelpButton();
        this.setHelpMenu();
    }


    /////////////////////////// spin head-up functions //////////////
    private createSpinSelector(): THREE.Sprite {
        let spinObject: THREE.Sprite = (this.createImageObject('spin2.png', 0, 100, 160, 160));
        return spinObject;
    }
    private createSpinText() {
        this.spinText = this.createImageObject('spintxt.png', 0, -300, 500, 90);
        this.headUpScene.add(this.spinText);
    }
    public rotateSpinImage() {

        if (this.rightSpinSelected) {
            this.spinObj.material.rotation -= 0.02 * Math.PI;
        }
        else if (this.leftSpinSelected) {
            this.spinObj.material.rotation += 0.02 * Math.PI;
        }
    }

    public selectSpin() {
        this.incrementIntervalTimer = setInterval(() => { this.rotateSpinImage(); }, 10);
    }

    private createLeftSpinButton(positionX: number, positionY: number): THREE.Sprite {
        let spinIconObject: THREE.Sprite = (this.createImageObject('Left-icon.png',
            positionX, positionY, 120, 120));
        return spinIconObject;
    }
    private createRightSpinButton(positionX: number, positionY: number): THREE.Sprite {
        let spinIconObject: THREE.Sprite = (this.createImageObject('Right-icon.png',
            positionX, positionY, 120, 120));
        return spinIconObject;
    }

    public createGoToDificultytButton() {
        this.goToDificultyButton = this.createImageObject('Go.png', 0, -120, 120, 120);
        this.headUpScene.add(this.goToDificultyButton);
    }

    public enableSpinSelector() {
        this.isSelectingSpin = true;
        this.leftSpinButton.visible = true;
        this.rightSpinButton.visible = true;
        this.goToDificultyButton.visible = true;
        this.spinObj.visible = true;
        this.spinText.visible = true;
    }

    public disableSpinSelector() {
        this.isSelectingSpin = false;
        this.leftSpinButton.visible = false;
        this.rightSpinButton.visible = false;
        this.goToDificultyButton.visible = false;
        this.spinObj.visible = false;
        this.spinText.visible = false;
    }


    /////////////////////////////////// setup mouse click ////////////////
    public onMouseClick(event: any) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    public intersectObject() {

        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.headUpCamera);

        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.headUpScene.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object === this.leftSpinButton
                && this.leftSpinButton.visible === true) {

                this.rightSpinSelected = false;
                this.leftSpinSelected = true;

                this.rotateSpinImage();
                console.log("spin left");

            } else if (intersects[i].object === this.rightSpinButton
                && this.rightSpinButton.visible === true) {

                this.leftSpinSelected = false;
                this.rightSpinSelected = true;
                this.rotateSpinImage();
                console.log("spin right");

            } else if (intersects[i].object === this.goToDificultyButton
                && this.goToDificultyButton.visible === true) {

                if (this.leftSpinSelected || this.rightSpinSelected) {

                    console.log("go Next");
                    this.enableSpeedSelector();
                    this.disableSpinSelector();
                }
                else if (!this.leftSpinSelected && !this.rightSpinSelected) {
                    console.log("you have to select a spin");
                }
            }
        }
    }
}
