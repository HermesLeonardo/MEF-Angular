import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { ProfilePageModule } from './page/profile-page/profile.module';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { SharedModule } from '../../shared/shared.module';

import { ConfigPageComponent } from './page/config-page/config-page.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [DashboardHomeComponent, ConfigPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HomeRoutingModule
  ],
  exports: [DashboardHomeComponent]
})
export class HomeModule {}
