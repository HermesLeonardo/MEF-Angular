import { LoginModule } from './modules/login/login.module';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ConfigPageModule } from './modules/home/page/config-page/config-page.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { ProfilePageModule } from './modules/home/page/profile-page/profile.module';
<<<<<<< HEAD
import { MatDialogModule } from '@angular/material/dialog';
=======
import { FileUploadModule } from './modules/file-upload/file-upload.module';
>>>>>>> 2c84a836472c922a34d375eefed863b1f5080054


import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
<<<<<<< HEAD
import { EmpresaModalComponent } from './shared/components/empresa-modal/empresa-modal.component';
import { MatSelectModule } from '@angular/material/select';
=======
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

>>>>>>> 2c84a836472c922a34d375eefed863b1f5080054


@NgModule({

  declarations: [
    AppComponent,
<<<<<<< HEAD
    EmpresaModalComponent,
=======
>>>>>>> 2c84a836472c922a34d375eefed863b1f5080054
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
<<<<<<< HEAD
    LoginModule,
    MatDialogModule,
    MatSelectModule,
=======
    MatOptionModule,
    MatSelectModule,
    MatTableModule,

    LoginModule,
    FileUploadModule,

>>>>>>> 2c84a836472c922a34d375eefed863b1f5080054
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}

