import { Injectable } from '@angular/core';
import { RecentFile, UploadedFile, StoredFile } from '../../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  gerarId(): string {
    return Math.random().toString(36).substring(2, 12) + Date.now();
  }

  async converterParaStoredFiles(files: UploadedFile[], companyId: number): Promise<StoredFile[]> {
    return await Promise.all(files.map(async (file) => new StoredFile(
      file.id,
      file.name,
      file.type,
      file.raw.size,
      file.date.toISOString(),
      file.category,
      await this.readFileAsBase64(file.raw),
      companyId,
      file.status ?? 'Ativo'
    )));
  }

  salvarFilesNoLocalStorage(companyId: number, novos: StoredFile[]) {
    const todosRaw = localStorage.getItem('uploadedFiles');
    const todos: StoredFile[] = todosRaw ? JSON.parse(todosRaw) : [];

    const atualizados = [
      ...todos.filter(existing =>
        !(existing.companyId === companyId &&
          novos.some(novo => novo.id === existing.id))
      ),
      ...novos
    ];

    localStorage.setItem('uploadedFiles', JSON.stringify(atualizados));
  }

  getFilesPorEmpresa(companyId: number): StoredFile[] {
    const raw = localStorage.getItem('uploadedFiles');
    const todos: StoredFile[] = raw ? JSON.parse(raw) : [];
    return todos.filter(f => f.companyId === companyId);
  }

  deletarFile(fileId: string, companyId: number) {
    const raw = localStorage.getItem('uploadedFiles');
    let lista: StoredFile[] = raw ? JSON.parse(raw) : [];
    lista = lista.filter(f => !(f.id === fileId && f.companyId === companyId));
    localStorage.setItem('uploadedFiles', JSON.stringify(lista));

    this.removerDosRecentes(fileId, companyId);
  }

  editarFileNomeCategoria(file: UploadedFile, companyId: number, originalName: string) {
    const raw = localStorage.getItem('uploadedFiles');
    const lista: StoredFile[] = raw ? JSON.parse(raw) : [];

    const index = lista.findIndex(f =>
      f.companyId === companyId &&
      f.name === originalName &&
      f.date === file.date.toISOString() &&
      f.sizeBytes === file.raw.size
    );

    if (index !== -1) {
      lista[index].name = file.name;
      lista[index].category = file.category;
      localStorage.setItem('uploadedFiles', JSON.stringify(lista));
    }
  }

  atualizarStatus(fileId: string, novoStatus: 'Ativo' | 'Inativo') {
    const raw = localStorage.getItem('uploadedFiles');
    if (!raw) return;
    const lista: StoredFile[] = JSON.parse(raw);
    const index = lista.findIndex(f => f.id === fileId);
    if (index !== -1) {
      lista[index].status = novoStatus;
      localStorage.setItem('uploadedFiles', JSON.stringify(lista));
    }

    const recentRaw = localStorage.getItem('recentFiles');
    if (recentRaw) {
      const recentList = JSON.parse(recentRaw);
      const match = recentList.find((r: any) => r.id === fileId);
      if (match) {
        match.status = novoStatus;
        localStorage.setItem('recentFiles', JSON.stringify(recentList));
      }
    }
  }

  salvarEmRecentes(file: UploadedFile, companyName: string, companyId: number) {
    const raw = localStorage.getItem('recentFiles');
    const lista: RecentFile[] = raw ? JSON.parse(raw) : [];

    const novaLista = [
      new RecentFile(
        file.id,
        file.name,
        file.type,
        file.size,
        new Date().toISOString(),
        file.category,
        file.raw,
        companyName,
        file.status ?? 'Ativo',
        companyId
      ),
      ...lista.filter(f => !(f.id === file.id && f.companyId === companyId))
    ];

    localStorage.setItem('recentFiles', JSON.stringify(novaLista));
  }

  limparRecentesOrfaos() {
    const recentRaw = localStorage.getItem('recentFiles');
    const uploadedRaw = localStorage.getItem('uploadedFiles');

    if (!recentRaw) return;

    const recentFiles = JSON.parse(recentRaw);
    const uploadedFiles = uploadedRaw ? JSON.parse(uploadedRaw) : [];

    const filtrados = recentFiles.filter((recent: any) =>
      uploadedFiles.some((up: any) => up.id === recent.id)
    );

    localStorage.setItem('recentFiles', JSON.stringify(filtrados));
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private removerDosRecentes(fileId: string, companyId: number) {
    const recentRaw = localStorage.getItem('recentFiles');
    if (!recentRaw) return;
    const lista: any[] = JSON.parse(recentRaw);
    const nova = lista.filter(f => !(f.id === fileId && f.companyId === companyId));
    localStorage.setItem('recentFiles', JSON.stringify(nova));
  }
}
