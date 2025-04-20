import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/home/page/dashboard-home/dashboard-home.component';
import { ConfigPageComponent } from './modules/home/page/config-page/config-page.component';
import { ProfileComponent } from './modules/home/page/profile-page/profile.component';

const routes: Routes = [
  { path: '', component: DashboardHomeComponent },
  { path: 'home', component: DashboardHomeComponent },
  { path: 'configurations', component: ConfigPageComponent },
  { path: 'profile', component: ProfileComponent },
  ];
  // { path: '**', redirectTo: '' } // opcional: redireciona qualquer rota inválida



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
