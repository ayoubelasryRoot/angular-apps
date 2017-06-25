import { Injectable } from '@angular/core';

@Injectable()

export class TimerService {
    private globalSeconds = 0;
    private started = true;

    constructor() {
        console.log("Timer service initialized...");
    }

    stopTimer() {
        this.started = false;
    }

    startTimer() {
        this.started = true;
    }

    resetTimer() {
        this.stopTimer();
        this.globalSeconds = 0;
    }

    incrementTimer(): number {
        if (this.started) {
            this.globalSeconds++;
        }
        return this.getCurrentTime();
    }

    getCurrentTime(): number {
        return this.globalSeconds;
    }
}
