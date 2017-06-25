import { Component } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

const REFRESHTIME = 1;

@Component({
    selector: 'dashboard, ng-if-simple,ngFor',
    templateUrl: '../html/dashboard.html',
    styleUrls: ['../css/dashleaderboard.css', '../css/styles.css']
})

export class DashboardComponent {
    entries: Object[] = [{ date: '', types: '', description: '' }];
    count: { easy: Number, hard: Number } = { easy: 0, hard: 0 };

    constructor(private dashboardService: DashboardService) {

    }

    private ngOnInit() {
        //Fetch array of journal entries
        this.dashboardService.getJournalEntries()
            .then((response) => {
                this.entries = response;
            });
        //Fetch number of sudokus
        this.dashboardService.getSudokuCount()
            .then((response) => {
                this.count = response;
            });
        this.refreshData();
    }

    //Refresh data every second
    private refreshData() {
        setTimeout(() => {
            this.ngOnInit();
        }, REFRESHTIME * 1000);
    }
}
