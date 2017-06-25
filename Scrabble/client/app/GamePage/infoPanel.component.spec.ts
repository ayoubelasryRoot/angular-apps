import { InfoPanelComponent } from './infoPanel.component';
import { TimerComponent } from '../GamePage/timer.component';
import { GameService } from '../GamePage/game.service';
import { LoginService } from '../login/login.service';
import { Letter } from './letter';
import { Player } from './player';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from 'chai';

describe('Info Panel', () => {
    let de: DebugElement;
    let comp: InfoPanelComponent;
    let fixture: ComponentFixture<InfoPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, RouterTestingModule],
            declarations: [InfoPanelComponent, TimerComponent],
            providers: [LoginService, GameService, MockBackend, BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (mockBackend: MockBackend, option: BaseRequestOptions) => {
                        return new Http(mockBackend, option);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        }).compileComponents().catch((e: Error) => {
            console.error('compileComponents', e.message);
        });        
    }));

    beforeEach(() => {
        try {
            fixture = TestBed.createComponent(InfoPanelComponent);
            comp = fixture.componentInstance;
        } catch (e) {
            console.error('createComponent', (e as Error).message);
        }

        let players: Player[] = [new Player('alex', 0), new Player('bob', 0)];
        comp["gameService"]['socket'] = {
            emit: () => { return; },
            on: () => { return; }
        } as any;
        comp["gameService"]['roomID'] = 10;
        comp["gameService"]['myPlayer'] = players[0];
        comp["gameService"]['players'] = players;

        fixture.detectChanges();
    });

    it('should create component', () => expect(comp).to.not.be.undefined);

    it('should disable turn changing', () => {
        comp.endGame();

        expect(comp.isGameOver).to.be.true;

        for (let i = 0; i < comp.players.length; i++) {
            expect(comp.players[i].getPriority()).to.equal(0);
        }
    });

    it('should enable quit game keyboard shortcut', () => {
        comp.endGame();

        expect(comp.isGameOver).to.be.true;
    });

    it('should display winner message', () => {
        comp.announceWinner('alex');
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('td[class=winner]'));
        const td = de.nativeElement;
        expect(td.innerText).to.have.string("WINNER!");
        expect(comp.players[0].getWinner()).to.be.true;
    });

});
