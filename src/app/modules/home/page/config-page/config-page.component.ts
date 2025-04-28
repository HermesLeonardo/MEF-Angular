import { Component } from '@angular/core';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css'],
  standalone: false
})
export class ConfigPageComponent {
  tema: 'claro' | 'escuro' = 'escuro';
  animacoes = true;
  alertasSistema = true;
  mostrarTooltips = true;
  confirmacoesRapidas = false;

  alterarTema(novoTema: 'claro' | 'escuro') {
    this.tema = novoTema;
    const root = document.documentElement;

    if (novoTema === 'claro') {
      root.style.setProperty('--bg-color', '#f1f5f9');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--text-color', '#0f172a');
    } else {
      root.style.setProperty('--bg-color', '#0f172a');
      root.style.setProperty('--card-bg', '#1e293b');
      root.style.setProperty('--text-color', '#ffffff');
    }
  }

  ngOnInit() {
    this.alterarTema(this.tema);
  }
}
