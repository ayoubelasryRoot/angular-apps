import { Injectable } from '@angular/core';

@Injectable()
export class QueueService {
    roomType: number;
    nbConnectedPlayers: number;

    constructor() {
        this.nbConnectedPlayers = 0;
    }

    public addConnectedPlayers() {
        this.nbConnectedPlayers++;
    }

    public chooseRoom(roomType: number) {
        this.roomType = roomType;
    }

}
