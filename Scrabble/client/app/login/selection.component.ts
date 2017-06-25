import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { QueueService } from './queue.service';
import { GameService } from '../GamePage/game.service';
import { Router } from '@angular/router';

@Component({
    selector: 'selection-comp',
    templateUrl: 'assets/html/selection.html',
    styleUrls: ['assets/css/selection.css']
})

export class SelectionComponent implements OnInit {
    message: string;

    constructor(private authService: AuthService, private router: Router,
        private queueServ: QueueService, private gameService: GameService) {
    }

    ngOnInit() {
        this.gameService.connectSocket();
    }

    addUserToRoom(event: any) {
        let roomType: number = event.target.getAttribute('value');     //room type represent the room size
        this.queueServ.chooseRoom(roomType);
    }
}
