
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaderboardComponent } from '../components/leaderboard.component';
import { DashboardComponent } from '../components/dashboard.component';
import { PlayerNameComponent } from '../components/player-name.component';
import { MoreComponent } from '../components/more/more.component';
import { LoginComponent } from '../components/login.component';
import { AuthGuard } from '../components/auth-guard.service';

import { GlComponent } from '../components/gl.component';
// TODO : Put the right paths
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'player', component: PlayerNameComponent },
  { path: 'scores', component: LeaderboardComponent },
  { path: 'glcomp', component: GlComponent, canActivate: [AuthGuard] },
  { path: 'more', component: MoreComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
