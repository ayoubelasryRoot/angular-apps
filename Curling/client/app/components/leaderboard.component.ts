import { Component } from '@angular/core';
import { LeaderboardService } from '../services/leaderboard.service';

@Component({
    selector: 'leaderboard-item',
    templateUrl: '../html/leaderboard.html',
    styleUrls: ['../css/styles.css']
})

export class LeaderboardComponent {
    scoreEasy: Object[] = [];
    scoreHard: Object[] = [];
    constructor(private lbService: LeaderboardService) {
        console.log("Leaderboard initialized...");
    }

    ngOnInit() {
        this.lbService.getLeaderboard()
            .then((res) => {
                console.log(res);
                this.scoreEasy = res.easy;
                this.scoreHard = res.hard;
            });
    }
}
