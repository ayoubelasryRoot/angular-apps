
import { Component, OnInit } from '@angular/core';
import { RenderService } from '../services/render.service';
import { LoginService } from '../services/login.service';
import { MdDialog, /*MdDialogRef,*/ MdSnackBar } from '@angular/material';
import { HostListener } from '@angular/core';


@Component({
    selector: 'my-gl',
    templateUrl: 'html/curlingscene.html',
    styleUrls: ['css/game.css']
})
export class GlComponent implements OnInit {
    webgltext: string;
    xmodel: number;
    ymodel: number;
    zCamera: number;

    ngOnInit(): void {
        this.webgltext = "";
        this.xmodel = this.ymodel = 0;
        this.zCamera = 0;
        this.renderService.setUserName(this.login.getName());
        this.renderService.setDialog(this.dialog);
        //console.log(this.trigger());
    }


    constructor(private renderService: RenderService,
        private snackbar: MdSnackBar, private login: LoginService,
        private dialog: MdDialog
    ) {
        //code source : http://stackoverflow.com/questions/10311341/confirmation-before-closing-of-tab-browser
        window.onbeforeunload = function (e: any) {
            e = e || window.event;

            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Sure?';
            }

            // For Safari
            return 'Sure?';
        };
    }

    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        let delatT = this.renderService.getClock();
        switch (event.keyCode) {
            case 65:
                this.renderService.animateArrow(delatT);
                break;
            case 68:
                this.renderService.animateArrow(-1 * delatT);
                break;
            case 67:
                this.renderService.cameraService.changeCamera();
                console.log("camera has changed");
                break;
            case 188: // left
                if (this.renderService.headUpService.isSelectingSpin
                    && !this.renderService.headUpService.leftSpinSelected) {
                    this.renderService.headUpService.leftSpinSelected = true;
                    this.renderService.headUpService.rightSpinSelected = false;
                }
                break;
            case 191: // right
                if (this.renderService.headUpService.isSelectingSpin
                    && !this.renderService.headUpService.rightSpinSelected) {
                    this.renderService.headUpService.rightSpinSelected = true;
                    this.renderService.headUpService.leftSpinSelected = false;
                }
                break;
            case 190: // right
                if (this.renderService.headUpService.isSelectingSpin
                    && this.renderService.headUpService.leftSpinSelected
                    || this.renderService.headUpService.rightSpinSelected) {

                    console.log("go Next");
                    this.renderService.headUpService.enableSpeedSelector();
                    this.renderService.headUpService.disableSpinSelector();
                }
                break;
            case 72:
                if (this.renderService.headUpService.menuIsSet) {
                    this.renderService.headUpService.disableHelpMenu();
                    this.renderService.headUpService.menuIsSet = false;
                    this.renderService.headUpService.helpButton.visible = false;
                } else if (!this.renderService.headUpService.menuIsSet) {
                    this.renderService.headUpService.enableHelpMenu();
                    this.renderService.headUpService.menuIsSet = true;
                    this.renderService.headUpService.helpButton.visible = true;
                }
                break;
            case 32:
            this.renderService.setNextRoud();
                break;
            default:
                console.log("key not valide !");
                break;
        }
    }


    // fonction temporaire pour eviter les tslint
    printThis() {
        console.log(this.displaceX());
        console.log(this.displaceY());
        console.log(this.displaceCameraZ());

    }

    throwStone(delatT: number) {
        this.renderService.setSpeed();
    }

    private displaceX(): void {
        this.renderService.translateMesh(this.xmodel, 0);
    }

    private displaceY(): void {
        this.renderService.translateMesh(0, this.ymodel);
    }
    private displaceCameraZ(): void {
        console.log(this.zCamera);
        this.renderService.cameraService.translateCamera(0, 0, this.zCamera);
    }

}

/*

    //private newTeapot(): void{
    //  for(let i = 0;i<1;++i)
    //    this.renderService.newTeapot();
    //if(Math.random())
    //  console.log('cyclomatic')
    // }

    private trigger(): string {
        let x;
        if (Math.random()) {
            //x = function*(){ let a = yield Math.random();}
        }
        if (x) {
            let _new = x();
            let r = _new.next();
            console.log(r);
        }
        else {
            x = function () { return 'À traduire'; };
            console.log(x() +
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam varius augue eget magna commodo, a ultrices justo pretium.
            Proin id egestas eros. Sed pellentesque turpis et augue volutpat,
            ut aliquet nisi dignissim. Integer lobortis ligula ac leo imperdiet,
            eu viverra.');
        }
        for (let i = 0; i < 42; ++i) {
            try {
                // let y = 1 / Math.random();
            } catch (e) {
                console.log(e);
                return 'Catched';
            } finally {
                continue;
            }
        }
        return 'Will I be returned?';
    }

    public showNotImplemented(): void {
        this.snackbar.open('Sorry, this is not implemented yet. Would you do it for me? :)', 'Yes');
    }
 */
