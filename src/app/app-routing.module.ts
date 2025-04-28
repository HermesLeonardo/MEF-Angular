import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/home/page/dashboard-home/dashboard-home.component';
import { ConfigPageComponent } from './modules/home/page/config-page/config-page.component';
import { LoginComponent } from './modules/login/page/login/login.component';
import { ProfileComponent } from './modules/home/page/profile-page/profile.component';
import { RegisterComponent } from './modules/login/page/register/register.component';
import { FileUploadComponent } from './modules/file-upload/file-upload.component';

const routes: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: DashboardHomeComponent },
  { path: 'configurations', component: ConfigPageComponent },
  { path: 'profile', component: ProfileComponent },

  { path: 'file-upload/:id', component: FileUploadComponent},

  { path: '**', redirectTo: 'login' } // fallback
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
