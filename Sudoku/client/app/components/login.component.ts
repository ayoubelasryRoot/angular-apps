import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';

@Component({
    selector: 'login-comp',
    templateUrl: '../html/login.html',
    styleUrls: ['../css/styles.css']
})
export class LoginComponent {
    private username = "";
    public errorInAuthentication: Boolean = false;

    constructor(private loginServ: LoginService, private router: Router, public dialog: MdDialog) {}

    onKey(event: any) { // without type info
        this.username = event.target.value;
    }
    getUsername() {
        return this.username;
    }

    login() {
        if (this.username.length < 1) {
            alert("Choose a valid username");
        } else {
            this.loginServ.addUsername(this.username)
                .then((resp: any) => {
                    if (resp.isLoggedIn) { //Si le serveur me retourne qu'il est logged in
                        this.router.navigate(['/Sudoku']); //on va a la page du Sudoku
                    } else { this.errorInAuthentication = true; } // Erreur de login
                })
                .catch((e) => { console.log(e); });
        }
    }

}
