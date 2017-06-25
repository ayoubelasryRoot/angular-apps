import { RackComponent } from './rack.component';
import { GameService } from '../GamePage/game.service';
import { Letter } from './letter';
import { Player } from './player';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { expect } from 'chai';

describe('Rack', () => {
    let de: DebugElement;
    let comp: RackComponent;
    let fixture: ComponentFixture<RackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [RackComponent],
            providers: [GameService, MockBackend, BaseRequestOptions,
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
            fixture = TestBed.createComponent(RackComponent);
            comp = fixture.componentInstance;
            
            comp.rack.push(new Letter('q'));
            comp.rack.push(new Letter('w'));
            comp.rack.push(new Letter('e'));
            comp.rack.push(new Letter('r'));
            comp.rack.push(new Letter('t'));
            comp.rack.push(new Letter('y'));
            comp.rack.push(new Letter(''));
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

    it('should change letter', () => {
        let expectArray: Letter[] = [
            new Letter('q'),
            new Letter('w'),
            new Letter('a'),
            new Letter('r'),
            new Letter('t'),
            new Letter('y'),
            new Letter(''),
        ]
        let letterToChange = 'e';
        let newLetter: Letter = new Letter('a');
        comp.changeLetter(letterToChange, newLetter);
        fixture.detectChanges();

        for (let i = 0; i < comp.rack.length; i++) {
            expect(comp.rack[i].getLetter()).to.equal(expectArray[i].getLetter());
        }
    });

    it('should not change anything when the letter to change is not in rack', () => {
        let expectArray: Letter[] = [
            new Letter('q'),
            new Letter('w'),
            new Letter('e'),
            new Letter('r'),
            new Letter('t'),
            new Letter('y'),
            new Letter(''),
        ]
        let letterToChange = 'z';
        let newLetter: Letter = new Letter('x');
        comp.changeLetter(letterToChange, newLetter);
        fixture.detectChanges();

        for (let i = 0; i < comp.rack.length; i++) {
            expect(comp.rack[i].getLetter()).to.equal(expectArray[i].getLetter());
        }
    });

    it('should be able to change blank letter', () => {
        let expectArray: Letter[] = [
            new Letter('q'),
            new Letter('w'),
            new Letter('e'),
            new Letter('r'),
            new Letter('t'),
            new Letter('y'),
            new Letter('u'),
        ]
        let letterToChange = '*';
        let newLetter: Letter = new Letter('u');
        comp.changeLetter(letterToChange, newLetter);
        fixture.detectChanges();

        for (let i = 0; i < comp.rack.length; i++) {
            expect(comp.rack[i].getLetter()).to.equal(expectArray[i].getLetter());
        }
    });

});
