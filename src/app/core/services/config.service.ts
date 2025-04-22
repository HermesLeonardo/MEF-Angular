import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly LANG_KEY = 'language';

  setLanguage(lang: string) {
    localStorage.setItem(this.LANG_KEY, lang);
  }

  getLanguage(): string {
    return localStorage.getItem(this.LANG_KEY) || 'pt-BR';
  }
}
