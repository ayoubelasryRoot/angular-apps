
import { Component } from '@angular/core';
import { RandomHttpService } from '../services/random-http.service';

@Component({
  moduleId: module.id,
  selector: 'mon-app',
  templateUrl: "/assets/templates/app-component-template.html",
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = "Check mon cube";
  //private value = "Hello World";
  public serviceValue = "";
  constructor(private randomHttpService: RandomHttpService) { }

  callService(): void {
    this.randomHttpService.getObject()
      .then(obj => {
        this.changeData(obj);
      })
      .catch(reason => {
        console.log(reason);
      });
  }
  changeData(obj: Object): void {
    this.serviceValue = obj['data'];
  }
}
