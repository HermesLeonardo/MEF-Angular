import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { IconInputComponent } from './components/icon-input/icon-input.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CompanyCardComponent } from './components/company-card/company-card.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    SidebarComponent,
    IconInputComponent,
    CustomButtonComponent,
    CompanyCardComponent,
    ConfirmDialogComponent,
  ],
  imports: [CommonModule, MatIconModule, FormsModule, MatDialogModule],
  exports: [
    SidebarComponent,
    IconInputComponent,
    CustomButtonComponent,
    CompanyCardComponent,
    FormsModule,
    ConfirmDialogComponent,
    MatDialogModule,
  ]
})
export class SharedModule {}
