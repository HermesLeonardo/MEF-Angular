import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { ConfigPageComponent } from './page/config-page/config-page.component';
import { ProfileComponent } from './page/profile-page/profile.component';

const routes: Routes = [
  { path: 'home', component: DashboardHomeComponent },
  { path: 'configurations', component: ConfigPageComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
