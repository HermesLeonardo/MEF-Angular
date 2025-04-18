import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './page/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    LoginComponent
  ]
})
export class LoginModule { }
