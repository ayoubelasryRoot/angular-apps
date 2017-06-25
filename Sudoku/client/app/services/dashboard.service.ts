import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class DashboardService {

    constructor(private http: Http) {
        console.log("Dashboard service initialized...");
    }

    getJournalEntries() {
        return this.http.get('http://localhost:3002/api/journal').toPromise()
            .then((resp) => {
                return resp.json();
            });
    }

    getSudokuCount() {
        return this.http.get('http://localhost:3002/api/sudokucount').toPromise()
            .then((resp) => {
                return resp.json();
            });
    }
}
