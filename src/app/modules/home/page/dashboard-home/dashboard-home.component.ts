import { Component } from '@angular/core';

// Enum alternativo (opcional, se quiser usar em vários lugares)
// export enum CompanyType {
//   COMPANY = 'company',
//   CLIENT = 'client'
// }

type CompanyType = 'company' | 'client';

interface Company {
  id: number;
  name: string;
  employeeCount: number;
  lastUpdate: string;
  type: CompanyType;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  standalone: false,
})
export class DashboardHomeComponent {
  searchQuery = '';

  companies: Company[] = [
    { id: 1, name: 'Empresa 1', employeeCount: 83, lastUpdate: '27/03/2025', type: 'company' },
    { id: 2, name: 'Cliente 1', employeeCount: 3, lastUpdate: '13/09/2024', type: 'client' },
    { id: 3, name: 'Empresa 2', employeeCount: 32, lastUpdate: '13/09/2024', type: 'company' },
    { id: 4, name: 'Cliente 2', employeeCount: 83, lastUpdate: '13/09/2024', type: 'client' },
    { id: 5, name: 'Empresa 3', employeeCount: 83, lastUpdate: '13/09/2024', type: 'company' },
    { id: 6, name: 'Cliente 3', employeeCount: 0, lastUpdate: '13/09/2024', type: 'client' }
  ];

  openAddCompanyModal() {
    // Aqui depois abriremos modal real (com PrimeNG)
    console.log('Abrir modal de nova empresa');
    alert('Abrir modal de nova empresa (em breve)');
  }
}
