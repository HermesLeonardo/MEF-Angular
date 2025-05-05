import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/api/company.service';

type CompanyType = 'company' | 'client';

interface FrontendCompany {
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
export class DashboardHomeComponent implements OnInit {
  constructor(private router: Router, private companyService: CompanyService) { }

  searchQuery = '';
  searchFile = '';

  currentPage = 1;
  itemsPerPage = 6;

  companies: Company[] = [];
  files: FileItem[] = [
    { name: 'bucetinha.pdf', destination: 'Empresa 7', size: '3.1 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'ghjkl.pdf', destination: 'Company 1', size: '1.6 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'sdfghuiop.pdf', destination: 'Empresa 1', size: '4.2 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'qualquer coisa.pdf', destination: 'Empresa 1', size: '1.2 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'Relatório Mensal.pdf', destination: 'Empresa 1', size: '1.2 MB', date: '27/03/2025', status: 'Ativo' },
    { name: 'Contratos 2024.docx', destination: 'Cliente 2', size: '0.8 MB', date: '13/09/2024', status: 'Inativo' },
  ];

  usuarioLogado: any; 
  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuarioLogado = JSON.parse(data);
    }

    this.loadCompanies();
  }


  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Erro ao buscar empresas', err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompaniesAll.length / this.itemsPerPage);
  }

  get filteredCompaniesAll(): FrontendCompany[] {
    return this.companies
      .filter(c => c.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      .map(c => ({
        id: c.id,
        name: c.name,
        employeeCount: c.funci_quanti || 0,
        lastUpdate: c.created_at,
        type: 'company' as CompanyType
      }));
  }

  get filteredCompanies(): FrontendCompany[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompaniesAll.slice(start, start + this.itemsPerPage);
  }

  get filteredFiles(): FileItem[] {
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
