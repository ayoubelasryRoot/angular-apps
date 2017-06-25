import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';

import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
    isLoggedIn: boolean;
    errorInAuthentication: Boolean = false;
    redirectUrl: string;  // store the URL so we can redirect after logging in

    constructor(private loginServ: LoginService, private router: Router) {
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
                    console.log("test");
                    this.isLoggedIn = resp.isLoggedIn;
                    console.log(this.isLoggedIn);
                    if (this.isLoggedIn) { //Si le serveur me retourne qu'il est logged in
                        this.router.navigate(['/glcomp']); //on va a la page du curling
                    } else { this.errorInAuthentication = true; } // Erreur de login
                })
                .catch((e) => { console.log(e); });
        }
        return this.isLoggedIn;
    }
}
