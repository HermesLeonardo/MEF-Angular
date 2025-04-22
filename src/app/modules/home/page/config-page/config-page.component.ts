import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  standalone: false,
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {
  notificacoesEmail = true;
  notificacoesApp = true;
  atualizacoesSistema = false;
  marketing = false;

  temaSelecionado = 'dark';

  novoUsuario = {
    nome: '',
    email: ''
  };

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.temaSelecionado = this.themeService.getTheme();
  }

  onTemaChange(theme: string) {
    this.temaSelecionado = theme;
    this.themeService.applyTheme(theme);
  }

  adicionarUsuario() {
    if (this.novoUsuario.nome && this.novoUsuario.email) {
      alert(`Usuário ${this.novoUsuario.nome} (${this.novoUsuario.email}) adicionado!`);
      this.novoUsuario = { nome: '', email: '' };
    }
  }
}
