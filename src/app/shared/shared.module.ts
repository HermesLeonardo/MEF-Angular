import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconInputComponent } from './components/icon-input/icon-input.component';
import { CompanyCardComponent } from './components/company-card/company-card.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    IconInputComponent,
    CompanyCardComponent,
    SidebarComponent,
    CustomButtonComponent
  ],
  imports: [CommonModule],
  exports: [
    IconInputComponent,
    CompanyCardComponent,
    SidebarComponent,
    CustomButtonComponent
  ]
})
export class SharedModule {}
