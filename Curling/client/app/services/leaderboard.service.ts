import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class LeaderboardService {

    constructor(private http: Http) {
        console.log("Leaderboard service initialized...");
    }

    postPlayerScore(name: string, difficulty: number, score: number): Promise<boolean> {
        return this.http.post('http://localhost:3002/api/userscore', {
            name: name,
            difficulty: difficulty,
            score: score
        }).toPromise()
            .then((resp) => {
                return resp.json();
            });
    }

    getLeaderboard(): Promise<any> {
        return this.http.get('http://localhost:3002/api/leaderboard').toPromise()
            .then((resp) => {
                //resp.json() doit p-e etre changer a resp tout cour
                return resp.json();
            });
    }
}
