import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UploadedFile, StoredFile } from '../../../../core/models/file.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent implements OnInit {
  companyId!: number;

  displayedColumns: string[] = ['name', 'type', 'date', 'size', 'category', 'actions'];
  dataSource = new MatTableDataSource<UploadedFile>([]);
  selectedFiles: UploadedFile[] = [];
  categories = [
    'Documentos Societários',
    'Contrato de Prestação',
    'Folha de Pagamento',
    'Certificado Digital'
  ];

  currentFilters: any = {
    name: '',
    type: '',
    date: '',
    size: '',
    category: ''
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  currentCompany: any;
  originalFileNameMap = new Map<UploadedFile, string>();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.companyId = Number(params.get('id'));
      const companiesStr = localStorage.getItem('empresas');
      const companies = companiesStr ? JSON.parse(companiesStr) : [];
      this.currentCompany = companies.find((c: any) => c.id === this.companyId);
      this.loadPersistedFiles();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: UploadedFile, property: string) => {
      switch (property) {
        case 'name': return item.name.toLowerCase();
        case 'date': return new Date(item.date).getTime();
        case 'size': return this.parseSize(item.size);
        case 'type': return item.type;
        case 'category': return item.category || '';
        default: return '';
      }
    };

    this.dataSource.filterPredicate = (data: UploadedFile) => this.filterData(data);
  }

  startEditing(file: UploadedFile) {
    file.editing = true;
    file.editingName = file.name;
    file.editingCategory = file.category;
    this.originalFileNameMap.set(file, file.name);
  }

  cancelEditing(file: UploadedFile) {
    file.editing = false;
    this.originalFileNameMap.delete(file);
  }

  saveEditing(file: UploadedFile) {
    if (file.editingName && file.editingName.trim()) {
      const originalName = this.originalFileNameMap.get(file) || file.name;
      
      file.name = file.editingName.trim();
      file.category = file.editingCategory ?? null;
      
      const newFile = new File([file.raw], file.name, {
        type: file.raw.type,
        lastModified: file.raw.lastModified
      });
      file.raw = newFile;

      this.updateStoredFile(file, originalName);
    }
    
    file.editing = false;
    this.originalFileNameMap.delete(file);
  }

  private updateStoredFile(file: UploadedFile, originalName: string) {
    const allFilesRaw = localStorage.getItem('uploadedFiles');
    let allFiles: StoredFile[] = allFilesRaw ? JSON.parse(allFilesRaw) : [];
    
    const index = allFiles.findIndex(f => 
      f.companyId === this.companyId &&
      f.name === originalName &&
      f.date === file.date.toISOString() &&
      f.sizeBytes === file.raw.size
    );
    
    if (index !== -1) {
      allFiles[index].name = file.name;
      allFiles[index].category = file.category;
      localStorage.setItem('uploadedFiles', JSON.stringify(allFiles));
      
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  deleteFile(file: UploadedFile) {
    const storedFiles = this.getStoredFiles();
    const updatedFiles = storedFiles.filter(sf =>
      !(sf.name === file.name &&
        sf.date === file.date.toISOString() &&
        sf.sizeBytes === file.raw.size)
    );

    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    this.dataSource.data = [...updatedFiles.map(sf => this.storedFileToUploadedFile(sf))];
    this.dataSource._updateChangeSubscription();
  }

  private loadPersistedFiles() {
    const storedFiles = this.getStoredFiles();
    const uploadedFiles = storedFiles.map(sf => this.storedFileToUploadedFile(sf));
    this.dataSource.data = uploadedFiles;
  }

  private getStoredFiles(): StoredFile[] {
    const storedFilesStr = localStorage.getItem('uploadedFiles');
    const allFiles: StoredFile[] = storedFilesStr ? JSON.parse(storedFilesStr) : [];
    return allFiles.filter(f => f.companyId === this.companyId);
  }

  private storedFileToUploadedFile(storedFile: StoredFile): UploadedFile {
    const base64Data = storedFile.content.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: storedFile.type });
    const file = new File([blob], storedFile.name, {
      type: storedFile.type,
      lastModified: new Date(storedFile.date).getTime()
    });

    return new UploadedFile(
      storedFile.name,
      storedFile.type,
      this.formatFileSize(storedFile.sizeBytes),
      new Date(storedFile.date),
      storedFile.category,
      file
    );
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    this.selectedFiles = [
      ...this.selectedFiles,
      ...files.map(file => new UploadedFile(
        file.name,
        file.type || file.name.split('.').pop() || 'unknown',
        this.formatFileSize(file.size),
        new Date(),
        null,
        file
      ))
    ];
  }

  async uploadFiles() {
    const newStoredFiles = await Promise.all(
      this.selectedFiles.map(async (file) => new StoredFile(
        file.name,
        file.type,
        file.raw.size,
        file.date.toISOString(),
        file.category,
        await this.readFileAsBase64(file.raw),
        this.companyId
      ))
    );

    const allFilesRaw = localStorage.getItem('uploadedFiles');
    const allFiles: StoredFile[] = allFilesRaw ? JSON.parse(allFilesRaw) : [];
    const cleanedCompanyFiles = allFiles.filter(existing =>
      existing.companyId !== this.companyId ||
      !newStoredFiles.some(newFile =>
        newFile.name === existing.name &&
        newFile.date === existing.date &&
        newFile.sizeBytes === existing.sizeBytes
      )
    );

    const updatedFiles = [...cleanedCompanyFiles, ...newStoredFiles];
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    this.dataSource.data = updatedFiles
      .filter(f => f.companyId === this.companyId)
      .map(sf => this.storedFileToUploadedFile(sf));

    this.selectedFiles = [];
    this.fileInputRef.nativeElement.value = '';
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  applyNameFilter(event: Event) {
    this.currentFilters.name = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applyTypeFilter(event: Event) {
    this.currentFilters.type = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applyDateFilter(event: Event) {
    this.currentFilters.date = (event.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applySizeFilter(event: Event) {
    this.currentFilters.size = (event.target as HTMLSelectElement).value;
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  applyCategoryFilter(event: Event) {
    this.currentFilters.category = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filter = JSON.stringify(this.currentFilters);
  }

  downloadFile(file: UploadedFile) {
    const url = URL.createObjectURL(file.raw);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  previewFile(file: UploadedFile) {
    const url = URL.createObjectURL(file.raw);
    if (file.type.includes('pdf') || file.type.includes('image') || file.type.includes('text')) {
      window.open(url, '_blank');
    } else {
      alert('Preview not available for this file type');
      this.downloadFile(file);
    }
    setTimeout(() => URL.revokeObjectURL(url), 5000);
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
      case 'small': return sizeInBytes < 1000000;
      case 'medium': return sizeInBytes >= 1000000 && sizeInBytes <= 5000000;
      default: return true;
    }
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

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}