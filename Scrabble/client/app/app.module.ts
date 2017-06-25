import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SelectionComponent } from './login/selection.component';
import { QueueComponent } from './login/queue.component';
import { PageNotFoundComponent } from './login/pageNotFound.component';
import { RackComponent } from './GamePage/rack.component';
import { GridComponent } from './GamePage/grid.component';
import { GameComponent } from './GamePage/game.component';
import { TimerComponent } from './GamePage/timer.component';
import { InfoPanelComponent } from './GamePage/infoPanel.component';
import { ChatComponent } from './GamePage/chat.component';
import { ReserveComponent } from './GamePage/reserve.component';

//service
import { AuthGuard } from './login/auth-guard.service';
import { AuthService } from './login/auth.service';
import { LoginService } from './login/login.service';
import { QueueService } from './login/queue.service';
import { GameService } from './GamePage/game.service';

import { MaterialModule } from '@angular/material';


export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'selection', component: SelectionComponent, canActivate: [AuthGuard] },
    { path: 'queue/:id', component: QueueComponent, canActivate: [AuthGuard] },
    { path: 'game', component: GameComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule.forRoot(appRoutes), MaterialModule.forRoot()],
    declarations: [AppComponent, LoginComponent, SelectionComponent, QueueComponent, PageNotFoundComponent,
        GameComponent, GridComponent, InfoPanelComponent, RackComponent, ReserveComponent,
        ChatComponent, TimerComponent],
    providers: [AuthGuard, AuthService, LoginService, QueueService, GameService],
    bootstrap: [AppComponent]
})

export class AppModule { }
