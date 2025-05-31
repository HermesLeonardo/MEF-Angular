import {
  Component, ViewChild, ElementRef, OnInit, AfterViewInit, ViewEncapsulation
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { UploadedFile, StoredFile, RecentFile } from '../../../../core/models/file.model';
import { RecentFilesService } from '../../../../core/services/api/recent-files.service';
import { ProfileService } from '../../../../core/services/api/profile.service';
import { Profile } from '../../../../core/models/profile.model';
import { FileUploadService } from '../../../../core/services/api/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class FileUploadComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  companyId!: number;
  currentCompany: any;
  usuario: Profile | null = null;
  selectedFiles: UploadedFile[] = [];
  dataSource = new MatTableDataSource<UploadedFile>([]);
  originalFileNameMap = new Map<UploadedFile, string>();

  displayedColumns: string[] = ['name', 'type', 'date', 'size', 'category', 'status', 'actions'];
  categories = ['Documentos Societários', 'Contrato de Prestação', 'Folha de Pagamento', 'Certificado Digital'];
  currentFilters: any = {
    name: '', type: '', date: '', size: '', category: ''
  };

  constructor(
    private route: ActivatedRoute,
    private recentFilesService: RecentFilesService,
    private profileService: ProfileService,
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.companyId = Number(params.get('id'));
      const companiesStr = localStorage.getItem('empresas');
      const companies = companiesStr ? JSON.parse(companiesStr) : [];
      this.currentCompany = companies.find((c: any) => c.id === this.companyId);
      this.usuario = this.profileService.obterDadosUsuarioLogado();

      this.loadPersistedFiles();
      this.fileUploadService.limparRecentesOrfaos();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: UploadedFile, prop: string): string | number => {
      switch (prop) {
        case 'name': return item.name.toLowerCase();
        case 'date': return new Date(item.date).getTime();
        case 'size': return this.parseSize(item.size);
        case 'type': return item.type.toLowerCase();
        case 'category': return item.category?.toLowerCase() || '';
        default:
          const value = item[prop as keyof UploadedFile];
          if (typeof value === 'string' || typeof value === 'number') return value;
          return '';
      }
    };

    this.dataSource.filterPredicate = (data: UploadedFile) => this.filterData(data);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const novos = files.map(file => new UploadedFile(
      this.fileUploadService.gerarId(),
      file.name,
      file.type,
      this.formatFileSize(file.size),
      new Date(),
      null,
      file,
      'Ativo'
    ));

    this.selectedFiles.push(...novos);
  }

  async uploadFiles(): Promise<void> {
    const stored = await this.fileUploadService.converterParaStoredFiles(this.selectedFiles, this.companyId);
    this.fileUploadService.salvarFilesNoLocalStorage(this.companyId, stored);

    this.loadPersistedFiles();

    for (const file of this.selectedFiles) {
      this.recentFilesService.addFile(new RecentFile(
        file.id, file.name, file.type, file.size,
        typeof file.date === 'string' ? file.date : file.date.toISOString(),
        file.category, file.raw,
        this.currentCompany?.name || 'Desconhecido',
        file.status ?? 'Ativo',
        this.companyId
      ));
    }

    this.selectedFiles = [];
    this.fileInputRef.nativeElement.value = '';
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  loadPersistedFiles(): void {
    const stored = this.fileUploadService.getFilesPorEmpresa(this.companyId);
    const uploaded = stored.map(f => this.storedFileToUploadedFile(f));
    this.dataSource.data = uploaded;
  }

  deleteFile(file: UploadedFile): void {
    this.fileUploadService.deletarFile(file.id, this.companyId);
    this.loadPersistedFiles();
  }

  startEditing(file: UploadedFile): void {
    file.editing = true;
    file.editingName = file.name;
    file.editingCategory = file.category;
    this.originalFileNameMap.set(file, file.name);
  }

  cancelEditing(file: UploadedFile): void {
    file.editing = false;
    this.originalFileNameMap.delete(file);
  }

  saveEditing(file: UploadedFile): void {
    if (file.editingName && file.editingName.trim()) {
      const originalName = this.originalFileNameMap.get(file) || file.name;
      file.name = file.editingName.trim();
      file.category = file.editingCategory ?? null;

      file.raw = new File([file.raw], file.name, {
        type: file.raw.type,
        lastModified: file.raw.lastModified
      });

      this.fileUploadService.editarFileNomeCategoria(file, this.companyId, originalName);
      this.fileUploadService.salvarEmRecentes(file, this.currentCompany?.name || '', this.companyId);
    }

    file.editing = false;
    this.originalFileNameMap.delete(file);
  }

  toggleStatus(file: UploadedFile): void {
    const novo = file.status === 'Ativo' ? 'Inativo' : 'Ativo';
    file.status = novo;
    this.fileUploadService.atualizarStatus(file.id, novo);
    this.fileUploadService.salvarEmRecentes(file, this.currentCompany?.name || '', this.companyId);
  }

  removerArquivoAnexado(file: UploadedFile): void {
    this.selectedFiles = this.selectedFiles.filter(f => f.id !== file.id);
  }

  downloadFile(file: UploadedFile): void {
    this.fileUploadService.salvarEmRecentes(file, this.currentCompany?.name || '', this.companyId);
    const url = URL.createObjectURL(file.raw);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  previewFile(file: UploadedFile): void {
    this.fileUploadService.salvarEmRecentes(file, this.currentCompany?.name || '', this.companyId);
    const url = URL.createObjectURL(file.raw);

    if (file.type.includes('pdf') || file.type.includes('image') || file.type.includes('text')) {
      window.open(url, '_blank');
    } else {
      alert('Preview não disponível. Baixando o arquivo...');
      this.downloadFile(file);
    }

    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // ----------------------------
  // 🔧 Filtros
  // ----------------------------
  applyNameFilter(e: Event) {
    this.currentFilters.name = (e.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applyTypeFilter(e: Event) {
    this.currentFilters.type = (e.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applyDateFilter(e: Event) {
    this.currentFilters.date = (e.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applySizeFilter(e: Event) {
    this.currentFilters.size = (e.target as HTMLSelectElement).value;
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applyCategoryFilter(e: Event) {
    this.currentFilters.category = (e.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  // ----------------------------
  // 🔧 Utilitários
  // ----------------------------
  private storedFileToUploadedFile(sf: StoredFile): UploadedFile {
    const base64Data = sf.content.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: sf.type });
    const file = new File([blob], sf.name, {
      type: sf.type,
      lastModified: new Date(sf.date).getTime()
    });

    return new UploadedFile(
      sf.id,
      sf.name,
      sf.type,
      this.formatFileSize(sf.sizeBytes),
      new Date(sf.date),
      sf.category,
      file,
      sf.status ?? 'Ativo'
    );
  }

  private filterData(data: UploadedFile): boolean {
    const filterDate = new Date(this.currentFilters.date);
    const fileDate = new Date(data.date);
    const sizeInBytes = this.parseSize(data.size);

    return (
      data.name.toLowerCase().includes(this.currentFilters.name) &&
      data.type.toLowerCase().includes(this.currentFilters.type) &&
      (this.currentFilters.date === '' || this.isSameDay(filterDate, fileDate)) &&
      this.checkSizeFilter(sizeInBytes) &&
      (data.category?.toLowerCase().includes(this.currentFilters.category) ||
        (this.currentFilters.category === '' && !data.category))
    );
  }

  private checkSizeFilter(sizeInBytes: number): boolean {
    switch (this.currentFilters.size) {
      case 'small': return sizeInBytes < 1_000_000;
      case 'medium': return sizeInBytes >= 1_000_000 && sizeInBytes <= 5_000_000;
      default: return true;
    }
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  }

  private parseSize(sizeString: string): number {
    const [value, unit] = sizeString.split(' ');
    const numericValue = parseFloat(value);
    switch (unit) {
      case 'KB': return numericValue * 1024;
      case 'MB': return numericValue * 1024 * 1024;
      default: return numericValue;
    }
  }
}
