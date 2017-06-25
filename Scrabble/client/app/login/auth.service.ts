import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { GameService } from '../GamePage/game.service';
import { Player } from '../GamePage/player';

import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
    isLoggedIn: boolean;
    errorInAuthentication = false;
    redirectUrl: string;  // store the URL so we can redirect after logging in

    constructor(private loginServ: LoginService, private router: Router, private gameService: GameService) {
    }

    onNgInit() {
        this.isLoggedIn = false;
    }

    addUser(username: string) {
        if (username.length < 1) {
            alert("Choose a valid username");
        } else {
            this.loginServ.addUsername(username)
                .then((resp: any) => {
                    this.isLoggedIn = resp.isLoggedIn;
                    if (this.isLoggedIn) {
                        this.gameService.setMyPlayer(new Player(username, 0));
                        this.router.navigate(['/selection']);
                    } else { this.errorInAuthentication = true; } // Erreur de login
                })
                .catch((e) => { console.log(e); });
        }
        return this.isLoggedIn;
    }
}
