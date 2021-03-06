import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class LoginService {

    private username: string;
    constructor(private http: Http) { }
    //Essai d'ajou de nom de joueur
    getName() {
        return this.username;
    }

    addUsername(name: string) {
        return this.http.post('http://localhost:3002/api/adduser', {
            username: name
        }).toPromise()
            .then((res) => {
                this.username = name;
                return res.json();
            });
    }

}
