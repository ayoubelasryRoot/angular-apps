import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { QueueService } from './queue.service';
import { GameService } from '../GamePage/game.service';

import { Subscription } from "rxjs";
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeuntil';

@Component({
    selector: 'queue-comp',
    templateUrl: `assets/html/queue.html`,
    styleUrls: ['assets/css/queue.css']
})

export class QueueComponent implements OnInit, OnDestroy {
    state: string[];
    nbPlayer: number;
    nbConnectedPlayer: number;

    private updateQueueSub: Subscription;
    private createRoomSub: Subscription;
    private ngUnsubscribe: Subject<void>;

    constructor(private route: ActivatedRoute, private router: Router,
        private queueServ: QueueService, private gameService: GameService) {
    }

    ngOnInit() {
        this.ngUnsubscribe = new Subject<void>();

        //initialize number of player and connected state of player as unjoined
        this.route.params.subscribe((params) => {
            this.nbPlayer = +params['id'];
            this.state = Array(this.nbPlayer).fill('sq-lg-unjoined');
        });

        this.updateQueueSub = this.gameService.updateQueue()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((data: number) => {
                this.updateQueue(data);
            });

        this.createRoomSub = this.gameService.createRoom()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((data: any) => {
                this.router.navigate(['/game']);
            });

        this.gameService.joinQueue(this.gameService.getMyPlayer().getName(), this.queueServ.roomType);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    //update the interface of queue
    private updateQueue(nbPlayer: number) {
        this.nbConnectedPlayer = nbPlayer;
        for (let i = 0; i < this.nbPlayer; i++) {
            if (i < this.nbConnectedPlayer) {
                this.state[i] = 'sq-lg-joined';
            } else {
                this.state[i] = 'sq-lg-unjoined';
            }
        }
    }

    removePlayer() {
        this.gameService.leaveQueue(this.gameService.getMyPlayer().getName(), this.queueServ.roomType);
    }
}
