import { Component } from '@angular/core';
//import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { MdDialog, /*MdDialogRef*/ } from '@angular/material';

import { AuthService } from './auth.service';

@Component({
    selector: 'login-comp',
    templateUrl: 'html/login.html',
    styleUrls: ['css/login2.css']
})

export class LoginComponent {
    username = "";
    isLoggedIn = false;
    public errorInAuthentication: Boolean = false;

    constructor(public authService: AuthService, private loginServ: LoginService,
        private router: Router, public dialog: MdDialog) { }


    onKey(event: any) { // without type info
        this.username = event.target.value;
    }

    login(event: any) {

        this.authService.addUser(this.username);
        this.errorInAuthentication = this.authService.errorInAuthentication;
    }
}
