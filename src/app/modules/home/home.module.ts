import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePageModule } from './page/profile-page/profile.module';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ProfilePageModule
  ],
  exports: [DashboardHomeComponent]
})
export class HomeModule {}
