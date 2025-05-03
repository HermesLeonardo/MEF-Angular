import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaModalComponent } from '../../../../shared/components/empresa-modal/empresa-modal.component';
import { EmpresaService } from '../../../../core/services/empresa.service';

type CompanyType = 'company' | 'client';

interface Company {
  id: number;
  name: string;
  employeeCount: number;
  lastUpdate: string;
  type: CompanyType;
  cnpj?: string;
  email?: string;
  telefone?: string;
  responsavel?: string;
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
  constructor(private router: Router, private dialog: MatDialog, private empresaService: EmpresaService) {}

  searchQuery = '';
  searchFile = '';

  currentPage = 1;
  itemsPerPage = 6;

  companies: Company[] = [];
  ngOnInit(): void {
    this.empresaService.empresas$.subscribe(empresas => {
      this.companies = empresas.map(empresa => ({
        id: (empresa as any).id || 0, // Ensure a default value if 'id' is missing
        name: empresa.nome,
        employeeCount: empresa.employeeCount || 0,
        lastUpdate: new Date().toLocaleDateString(),
        type: empresa.type || 'company',
        cnpj: empresa.cnpj,
        email: empresa.email,
        telefone: empresa.telefone,
        responsavel: empresa.responsavel,
      }));
    });
  }

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
    const dialogRef = this.dialog.open(EmpresaModalComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Empresa cadastrada:', result);
        this.empresaService.adicionarEmpresa(result); // <- importante
    
        // Vai para a última página automaticamente
        this.currentPage = this.totalPages;
      }
    });
  }

  goToCompany(id: number) {
    this.router.navigate(['/company', id]);
  }
}
