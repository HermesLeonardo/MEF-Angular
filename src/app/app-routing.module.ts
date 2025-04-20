import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/home/page/dashboard-home/dashboard-home.component';
import { ConfigPageComponent } from './modules/home/page/config-page/config-page.component';
import { LoginComponent } from './modules/login/page/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardHomeComponent },
  { path: 'configurations', component: ConfigPageComponent },
  { path: '**', redirectTo: 'login' } // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
