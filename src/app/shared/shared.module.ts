import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { IconInputComponent } from './components/icon-input/icon-input.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CompanyCardComponent } from './components/company-card/company-card.component';

@NgModule({
  declarations: [
    SidebarComponent,
    IconInputComponent,
    CustomButtonComponent,
    CompanyCardComponent
  ],
  imports: [CommonModule],
  exports: [
    SidebarComponent,
    IconInputComponent,
    CustomButtonComponent,
    CompanyCardComponent,
    SidebarComponent
  ]
})
export class SharedModule {}
