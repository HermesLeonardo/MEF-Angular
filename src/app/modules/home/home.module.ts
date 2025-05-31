import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { SharedModule } from '../../shared/shared.module';
import { AddCompanyModalComponent } from './page/company-modal/add-company-modal.component';
import { ProfilePageModule } from './page/profile-page/profile.module';
import { ConfigPageComponent } from './page/config-page/config-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CompanyDetailModalComponent } from './page/company-detail-modal/company-detail-modal.components';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DashboardHomeComponent, ConfigPageComponent, AddCompanyModalComponent, CompanyDetailModalComponent,],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HomeRoutingModule,
    ProfilePageModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
    
  ],
  providers: [provideNgxMask()],
  exports: [DashboardHomeComponent, CompanyDetailModalComponent]
})
export class HomeModule { }
