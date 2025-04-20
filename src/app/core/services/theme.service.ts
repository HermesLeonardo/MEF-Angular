import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 'dark';
    this.applyTheme(savedTheme);
  }

  applyTheme(theme: string) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem(this.THEME_KEY, theme);
  }

  getTheme(): string {
    return localStorage.getItem(this.THEME_KEY) || 'dark';
  }
}
