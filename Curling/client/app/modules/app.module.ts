import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { DashboardComponent } from '../components/dashboard.component';
import { PlayerNameComponent } from '../components/player-name.component';
import { MoreComponent } from '../components/more/more.component';
import { AuthService } from '../components/auth.service';
import { AuthGuard } from '../components/auth-guard.service';
import { LoginService } from '../services/login.service';
import { LoginComponent } from '../components/login.component';
import { LeaderboardComponent } from '../components/leaderboard.component';
import { ModifierDirective } from '../directives/modifier.directive';

import { RenderService } from '../services/render.service';
import { RandomHttpService } from '../services/random-http.service';
import { PhysicsService } from '../services/physics.service';
import { HardAIService } from '../services/hardai.service';
import { LeaderboardService } from '../services/leaderboard.service';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [AppComponent, GlComponent, DashboardComponent, ModifierDirective,
    PlayerNameComponent, MoreComponent, LoginComponent, LeaderboardComponent],
  providers: [RenderService, RandomHttpService, LoginService, AuthGuard, AuthService, PhysicsService,
    LeaderboardService, HardAIService],
  bootstrap: [AppComponent]
})

export class AppModule { /**/ }
