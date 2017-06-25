import { Component } from '@angular/core';
import { SudokuService } from '../services/sudoku.service';

@Component({
    selector: 'leaderboard-item',
    templateUrl: '../html/leaderboard.html',
    styleUrls: ['../css/dashleaderboard.css', '../css/styles.css']
})

export class LeaderboardComponent {
    scoreEasy: Object[] = [];
    scoreHard: Object[] = [];
    constructor(private sudokuService: SudokuService) {
    }
    ngOnInit() {
        this.sudokuService.getLeaderboard()
            .then((res) => {
                this.scoreEasy = res.easy;
                this.scoreHard = res.hard;
            });
    }
}
