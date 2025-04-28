import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfigPageComponent } from './config-page.component';
import { SharedModule } from '../../../../shared/shared.module';
@NgModule({
  declarations: [ConfigPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
  ],
  exports: [ConfigPageComponent]
})
export class ConfigPageModule {}
