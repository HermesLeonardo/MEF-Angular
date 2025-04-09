import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css'],
  standalone: false
})
export class CompanyCardComponent {
  @Input() name!: string;
  @Input() employeeCount!: number;
  @Input() lastUpdate!: string;
  @Input() type!: 'company' | 'client';
}
