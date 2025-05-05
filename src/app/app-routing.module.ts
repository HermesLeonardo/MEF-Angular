import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DashboardHomeComponent } from './modules/home/page/dashboard-home/dashboard-home.component';
// import { ConfigPageComponent } from './modules/home/page/config-page/config-page.component';
// import { LoginComponent } from './modules/login/page/login/login.component';
// import { ProfileComponent } from './modules/home/page/profile-page/profile.component';
// import { RegisterComponent } from './modules/login/page/register/register.component';
// import { FileUploadComponent } from './modules/file-upload/file-upload.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Lazy loading para módulo de login
  {
    path: '',
    loadChildren: () =>
      import('./modules/login/login.module').then(m => m.LoginModule)
  },

  // Lazy loading para módulo da home/dashboard
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule)
  },

  { path: '**', redirectTo: 'login' } // fallback
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
