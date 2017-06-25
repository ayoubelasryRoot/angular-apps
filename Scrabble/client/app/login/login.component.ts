import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { AuthService } from './auth.service';



@Component({
    selector: 'login-comp',
    templateUrl: 'assets/html/login.html',
    styleUrls: ['assets/css/login.css']
})



export class LoginComponent {
    username = "";
    isLoggedIn = false;
    errorInAuthentication: Boolean = false;

    constructor(private authService: AuthService,
        private router: Router, private dialog: MdDialog) {
    }

    onKey(event: any) { // without type info
        this.username = event.target.value;
    }

    login(event: any) {
        this.authService.addUser(this.username);
        this.errorInAuthentication = this.authService.errorInAuthentication;
    }

}

