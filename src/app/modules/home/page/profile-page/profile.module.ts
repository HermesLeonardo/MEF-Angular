import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
  
  ],
  exports: [ProfileComponent],
})
export class ProfilePageModule {}
