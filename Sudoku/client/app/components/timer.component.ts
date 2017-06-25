import { Component } from '@angular/core';
import { TimerService } from '../services/timer.service';

@Component({
    selector: 'timer-sudoku, TimerService',
    templateUrl: '../html/timer.html',
    styleUrls: ['../css/timer.css']
})

export class TimerComponent {

    private hour = 0;
    private minute = 0;
    private second = 0;
    private globalSeconds = 0;
    public hourHH = "00";
    public minuteMM = "00";
    public secondSS = "00";

    constructor(private timerService: TimerService) {
        setInterval(() => {
            this.globalSeconds = this.timerService.incrementTimer();
            this.incrementTime();
        }, 1000);
    }

    private incrementTime() {
        this.second = Math.floor(this.globalSeconds % 60);
        this.minute = Math.floor(this.globalSeconds / 60) % 60;
        this.hour = Math.floor(this.globalSeconds / 3600);
        this.padTime();
    }

    private padTime() {
        this.hourHH = ("0" + this.hour.toString()).slice(-2);
        this.minuteMM = ("0" + this.minute.toString()).slice(-2);
        this.secondSS = ("0" + this.second.toString()).slice(-2);
    }

    afficherChronometre() {
        if (document.getElementById("chronometre").className === "chronometreVisible") {
            document.getElementById("chronometre").className = "chronometreCache";
        }
        else {
            document.getElementById("chronometre").className = "chronometreVisible";
        }
    }

}
