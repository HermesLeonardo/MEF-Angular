import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '../../../../shared/shared.module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [ ProfileComponent ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxMaskDirective,
    
  ],
  providers: [provideNgxMask()],
  exports: [],
})
export class ProfilePageModule {}
