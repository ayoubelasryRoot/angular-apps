import { Component } from '@angular/core';

@Component({
    selector: 'control-panel',
    templateUrl: 'controlPanel.component.html',
    styleUrls:  []
})

export class ControlPanelComponent {
    title = "Sudoku";
    difficulty : string;
    isShown = true;
}
