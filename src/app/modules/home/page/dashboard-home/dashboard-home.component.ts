import { Component } from '@angular/core';
import { Router } from '@angular/router';

type CompanyType = 'company' | 'client';

interface Company {
  id: number;
  name: string;
  employeeCount: number;
  lastUpdate: string;
  type: CompanyType;
}

interface FileItem {
  name: string;
  destination: string;
  size: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  standalone: false,
})
export class DashboardHomeComponent {
  constructor(private router: Router) {}

  searchQuery = '';
  searchFile = '';

  currentPage = 1;
  itemsPerPage = 6;

  companies: Company[] = [
    { id: 1, name: 'Empresa 1', employeeCount: 83, lastUpdate: '27/03/2025', type: 'company' },
    { id: 2, name: 'Cliente 2', employeeCount: 3, lastUpdate: '13/09/2024', type: 'client' },
    { id: 3, name: 'Empresa 3', employeeCount: 32, lastUpdate: '13/09/2024', type: 'company' },
    { id: 4, name: 'Cliente 4', employeeCount: 83, lastUpdate: '13/09/2024', type: 'client' },
    { id: 5, name: 'Empresa 6', employeeCount: 83, lastUpdate: '13/09/2024', type: 'company' },
    { id: 6, name: 'Cliente 10', employeeCount: 0, lastUpdate: '13/09/2024', type: 'client' },
  ];

  files: FileItem[] = [
    { name: 'bucetinha.pdf', destination: 'Empresa 7', size: '3.1 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'ghjkl.pdf', destination: 'Company 1', size: '1.6 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'sdfghuiop.pdf', destination: 'Empresa 1', size: '4.2 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'qualquer coisa.pdf', destination: 'Empresa 1', size: '1.2 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'Relatório Mensal.pdf', destination: 'Empresa 1', size: '1.2 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'Contratos 2024.docx', destination: 'Cliente 2', size: '0.8 MB', date: '13/09/2024', status: 'Inativo' },
  ];

  get totalPages(): number {
    return Math.ceil(this.filteredCompaniesAll.length / this.itemsPerPage);
  }

  get filteredCompaniesAll() {
    return this.companies.filter(c =>
      c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  get filteredCompanies() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompaniesAll.slice(start, start + this.itemsPerPage);
  }

  get filteredFiles() {
    return this.files.filter(f =>
      f.name.toLowerCase().includes(this.searchFile.toLowerCase())
    );
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  openAddCompanyModal() {
    alert('Abrir modal de nova empresa (em breve)');
  }

  goToCompany(id: number) {
    this.router.navigate(['/file-upload', id]);
  }
}
