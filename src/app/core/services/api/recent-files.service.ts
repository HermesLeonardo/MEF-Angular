import { Injectable } from '@angular/core';
import { RecentFile } from '../../models/file.model';


@Injectable({
  providedIn: 'root'
})
export class RecentFilesService {
  private storageKey = 'recentFiles';
  private maxFiles = 10;

  getFiles(): RecentFile[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  addFile(file: RecentFile): void {
    const files = this.getFiles();
    files.unshift(file);
    const unique = this.removeDuplicates(files).slice(0, this.maxFiles);
    localStorage.setItem(this.storageKey, JSON.stringify(unique));
  }

  private removeDuplicates(files: RecentFile[]): RecentFile[] {
    const seen = new Set();
    return files.filter(file => {
      const key = `${file.name}-${file.companyId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
