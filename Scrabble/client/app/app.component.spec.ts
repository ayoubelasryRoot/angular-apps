import { AppComponent } from './app.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NgModule } from '@angular/core';

import { expect } from 'chai';

@Component({
    template: ``
})
class MockLoginComponent { }

@NgModule({
    declarations: [MockLoginComponent],
    exports: [MockLoginComponent]
})
class MockModule { }

describe('AppComponent', function () {
    let comp: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MockModule,
                RouterTestingModule.withRoutes([
                    {
                        path: 'login',
                        component: MockLoginComponent
                    }
                ]),
            ],
            declarations: [
                AppComponent
            ],
            providers: []
        })
        .compileComponents().catch((e: Error) => { console.log(e.message); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
    });

    it('should create component', () => expect(comp).to.not.be.undefined);

});
