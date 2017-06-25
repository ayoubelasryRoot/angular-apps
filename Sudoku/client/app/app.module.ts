import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { GrilleComponent } from './components/grille.component';
import { TimerComponent } from './components/timer.component';
import { TimerService } from './services/timer.service';
import { SudokuService } from './services/sudoku.service';
import { LoginComponent } from './components/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { DashboardComponent } from './components/dashboard.component';
import { DashboardService } from './services/dashboard.service';
import { LeaderboardComponent } from './components/leaderboard.component';
import { MaterialModule } from '@angular/material';


const appRoutes: Routes = [
  {
    path: 'Sudoku', component: GrilleComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'leaderboard', component: LeaderboardComponent
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  }
];



@NgModule({
  imports: [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(appRoutes),
    MaterialModule.forRoot()],
  declarations: [AppComponent, GrilleComponent, TimerComponent, LoginComponent, DashboardComponent,
    LeaderboardComponent],
  bootstrap: [AppComponent],
  providers: [SudokuService, LoginService, DashboardService, TimerService]
})

export class AppModule { }
