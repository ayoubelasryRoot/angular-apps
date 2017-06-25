import { AppComponent } from './app.component';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
// Un peu plus de recherche est nécessaire pour comprendre cette
// ligne suivante
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RandomHttpService } from '../services/random-http.service';

import { expect, /*assert*/ } from 'chai';
import * as sinon from 'sinon';
import * as SinonChai from 'sinon-chai';
chai.use(SinonChai);


class RouterStub {
  navigateByUrl(url: string) { return url; }
}

class RandomServiceStub{
  private retValue = "This is a stubbed value from a stubbed service";
  getObject(): Promise<Object>{
    return Promise.resolve({
      data: this.retValue || "Default",
    });
  }
}

describe('AppComponent', function () {
  let de: DebugElement;
  let data: DebugElement;
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let randomHttpService: RandomHttpService;
  //let objectSpy: sinon.SinonSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AppComponent ],
      providers: [{provide: RandomHttpService, useClass: RandomServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h1'));
    data = fixture.debugElement.query(By.css('div'));
    randomHttpService = fixture.debugElement.injector.get(RandomHttpService);

     sinon.stub(randomHttpService, 'getObject',
      (): Promise<Object> => {
          return Promise.resolve({
            data: 'Hey I was a stub with Sinon =)'
          });
      });
  });

  it('should create component', () => expect(comp).to.not.be.undefined );

  it('should have expected <h1> text', () => {
    fixture.detectChanges();
    const h1 = de.nativeElement;
    expect(h1.innerText).to.match(/cube/i,
      '<h1> should say something about "a cube"');
  });

  it ('should get display the value when service called', (done) => {
    const elem = data.nativeElement;
    fixture.detectChanges();
    //const expectedString = "This is a stubbed value from a stubbed service";

    randomHttpService.getObject().then((obj) => {
      comp.changeData(obj);
      fixture.detectChanges();
      expect(elem.innerText).to.match(/stub/i, 'say something about a stub');
      done();
    });
  });

  it('should be able to spy on service', (done) => {
    const elem = <HTMLDivElement> data.nativeElement;

    fixture.detectChanges();
    comp.callService();
    fixture.detectChanges();

    fixture.whenStable()
    .then((v) => {
      fixture.detectChanges();
      expect(elem.innerText)
        .to.match(/sinon/i, 'to say something about Sinon');
      done();
    })
    .catch((r => {
      console.log(r);
      done(r);
    }));
  });
});
