import { ChatComponent } from './chat.component';
import { LoginService } from '../login/login.service';
import { GameService } from '../GamePage/game.service';
import { Player } from './player';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { expect } from 'chai';

describe('Chat', () => {
    let de: DebugElement;
    let comp: ChatComponent;
    let fixture: ComponentFixture<ChatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [ChatComponent],
            providers: [LoginService, GameService, MockBackend, BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (mockBackend: MockBackend, option: BaseRequestOptions) => {
                        return new Http(mockBackend, option);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }

            ]
        })
            .compileComponents().catch((e: Error) => {
                console.error('compileComponents', e.message);
            });
    }));

    beforeEach(() => {
        try {
            fixture = TestBed.createComponent(ChatComponent);
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

    it('should print error message', () => {
        comp.onEnter("!notACommand");
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('div[id = chatBox]'));
        const div = de.nativeElement;
        expect(div.innerText).to.have.string("Entrée Invalide");
    });

    it('should print error message for invalid syntax', () => {
        comp.onEnter("!notACommand");
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('div'));
        const div = de.nativeElement;
        expect(div.innerText).to.have.string("Entrée Invalide");
    });

    it('should display help menu', () => {
        comp.onEnter("!aide");
        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('div[id=helpMenuID]'));
        const div = de.nativeElement;
        expect(div).to.exist;
    });

    it('should hide help menu by default', () => {
        fixture.detectChanges();
        expect(comp.isHelpMenuOpen).to.be.false;
    });

    it('should hide help menu', () => {
        comp.onEnter("!aide");
        fixture.detectChanges();
        expect(comp.isHelpMenuOpen).to.be.true;
        comp.onEnter("!quitter");
        fixture.detectChanges();
        expect(comp.isHelpMenuOpen).to.be.false;
    });

});
