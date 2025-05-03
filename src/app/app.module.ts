import { LoginModule } from './modules/login/login.module';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ConfigPageModule } from './modules/home/page/config-page/config-page.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { ProfilePageModule } from './modules/home/page/profile-page/profile.module';
import { MatDialogModule } from '@angular/material/dialog';


import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmpresaModalComponent } from './shared/components/empresa-modal/empresa-modal.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({

  declarations: [
    AppComponent,
    EmpresaModalComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    ConfigPageModule,
    HomeModule,
    SharedModule,
    ProfilePageModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    LoginModule,
    MatDialogModule,
    MatSelectModule,
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}

