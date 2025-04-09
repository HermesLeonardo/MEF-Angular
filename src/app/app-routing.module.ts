import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './modules/home/page/dashboard-home/dashboard-home.component';

const routes: Routes = [
  { path: '', component: DashboardHomeComponent },
  // { path: '**', redirectTo: '' } // opcional: redireciona qualquer rota inválida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
