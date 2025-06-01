import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from '../../../../core/models/company.model';
import { CompanyService } from '../../../../core/services/api/company.service';
import { RecentFilesService } from '../../../../core/services/api/recent-files.service';
import { RecentFile } from '../../../../core/models/file.model';
import { MatDialog } from '@angular/material/dialog';
import { CompanyDetailModalComponent } from '../company-detail-modal/company-detail-modal.components';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProfileService } from '../../../../core/services/api/profile.service';
import { Profile } from '../../../../core/models/profile.model';

type CompanyType = 'company' | 'client';

interface FrontendCompany {
  id: number;
  name: string;
  employeeCount: number;
  lastUpdate: string;
  type: CompanyType;
}

@Component({
  standalone: false,
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
})
export class DashboardHomeComponent implements OnInit {
  constructor(
    private router: Router,
    private companyService: CompanyService,
    private recentFilesService: RecentFilesService,
    private dialog: MatDialog,
    private profileService: ProfileService
  ) { }

  searchQuery = '';
  searchFile = '';
  modalAberto = false;

  currentPage = 1;
  itemsPerPage = 8;

  companies: Company[] = [];
  files: RecentFile[] = [];
  usuarioLogado: any;

  usuario: Profile | null = null;
  ngOnInit(): void {
    const data = localStorage.getItem('usuario_logado');
    if (data) {
      this.usuarioLogado = JSON.parse(data);
    }

    this.loadCompanies();
    this.loadFiles();
    this.usuario = this.profileService.obterDadosUsuarioLogado();
  }

  loadCompanies(): void {
    this.companies = this.companyService.getCompanies();
  }

  loadFiles(): void {
    this.files = this.recentFilesService.getFiles();
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
        lastUpdate: c.updated_at || c.created_at,
        type: 'company' as CompanyType
      }));
  }

  get filteredCompanies(): FrontendCompany[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCompaniesAll.slice(start, start + this.itemsPerPage);
  }

  get filteredFiles(): RecentFile[] {
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

  fecharModal() {
    this.modalAberto = false;
  }

  atualizarLista() {
    this.loadCompanies();
  }

  goToCompany(id: number) {
    this.router.navigate(['/file-upload', id]);
  }

  visualizarEmpresa(companySummary: FrontendCompany, event: MouseEvent) {
    event.stopPropagation();

    const fullCompany = this.companyService.getCompanyById(companySummary.id);
    if (!fullCompany) return;

    const dialogRef = this.dialog.open(CompanyDetailModalComponent, {
      data: { company: fullCompany },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'atualizado') {
        this.atualizarLista(); 
      }
    });
  }



  excluirEmpresa(companyId: number, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: 'Tem certeza que deseja excluir esta empresa?',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const raw = localStorage.getItem('empresas');
        const empresas = raw ? JSON.parse(raw) : [];

        const atualizadas = empresas.filter((empresa: any) => empresa.id !== companyId);
        localStorage.setItem('empresas', JSON.stringify(atualizadas));

        this.atualizarLista();
      }
    });
  }
}
