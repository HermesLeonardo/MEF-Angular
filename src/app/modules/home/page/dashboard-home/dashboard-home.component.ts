import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/api/company.service';
import { AddCompanyModalComponent } from '../company-modal/add-company-modal.component';

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
  standalone: false,
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  constructor(private router: Router, private companyService: CompanyService) { }

  searchQuery = '';
  searchFile = '';

  modalAberto = false;

  currentPage = 1;
  itemsPerPage = 6;

  companies: Company[] = [];
  files: FileItem[] = [];

  usuarioLogado: any;

  ngOnInit(): void {
    const data = localStorage.getItem('usuario');
    if (data) {
      this.usuarioLogado = JSON.parse(data);
    }

    this.loadCompanies();
    this.loadFiles(); // Aqui futuramente entra a chamada pro backend
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Erro ao buscar empresas', err);
      },
    });
  }

  // Esta função está preparada para futura integração com o backend
  loadFiles(): void {
    this.files = [
      { name: 'Relatório Financeiro.pdf', destination: 'Empresa X', size: '2.5 MB', date: '03/05/2025', status: 'Ativo' },
      { name: 'Contrato Assinado.docx', destination: 'Cliente Y', size: '1.3 MB', date: '02/05/2025', status: 'Inativo' },
    ];
    // Quando o backend estiver pronto:
    // this.fileService.getRecentFiles().subscribe(data => this.files = data);
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
        lastUpdate: c.updated_at || c.created_at, // ← usa updated_at se disponível
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
    this.modalAberto = true;
  }

  goToCompany(id: number) {
    this.router.navigate(['/file-upload', id]);
  }

  fecharModal() {
    this.modalAberto = false;
  }

  atualizarLista() {
    this.loadCompanies();
  }

}


