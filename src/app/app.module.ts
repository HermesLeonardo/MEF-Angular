import { LoginModule } from './modules/login/login.module';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
// import { ConfigPageModule } from './modules/home/page/config-page/config-page.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
// import { ProfilePageModule } from './modules/home/page/profile-page/profile.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';


import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';



@NgModule({

  declarations: [
    AppComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    // ConfigPageModule,
    HomeModule,
    SharedModule,
    // ProfilePageModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    FormsModule,

    LoginModule,
    FileUploadModule,

    HttpClientModule,

  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})


export class AppModule {}

