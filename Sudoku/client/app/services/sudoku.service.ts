import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class SudokuService {
    public m: number[][];
    constructor(private http: Http) {
        console.log('Service Initialised ...');
    }

    getSudokuFacile(): Promise<any> {
        return this.http.get('http://localhost:3002/api/sudokueasy').toPromise()
            .then((resp) => {
                return resp.json();
            });
    }

    getSudokuDifficile(): Promise<any> {
        return this.http.get('http://localhost:3002/api/sudokuhard').toPromise()
            .then((resp) => {
                return resp.json();
            });
    }

    postPlayerScore(name: string, difficulty: number, time: string): Promise<boolean> {
        return this.http.post('http://localhost:3002/api/userscore', {
            name: name,
            difficulty: difficulty,
            time: time
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

    setMatrix(m: number[][]) {
        this.m = m;
    }

    getMatrix(): number[][] {
        return this.m;
    }
}
