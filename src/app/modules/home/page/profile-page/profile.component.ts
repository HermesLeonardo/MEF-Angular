import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Usuario } from '../../../../core/models/usuario.model';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  standalone: false,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  usuario: Usuario = {
    id: 1,
    nome: 'João Silva',
    cargo: 'Administrador',
    email: 'joao.silva@escritoriox.com',
    telefone: '(11) 98765-4321',
    cpfCnpj: '123.456.789-00',
    empresa: 'Escritório X',
  };

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  editando = false;
  fotoSelecionada: File | null = null;
  fotoPreviewUrl: SafeUrl | null = null;

  // Modal de exclusão
  exibindoConfirmacao = false;
  confirmarExclusao = false;
  tentouExcluirSemCheckbox = false;

  constructor(
    private sanitizer: DomSanitizer,
    private userDataService: UserDataService
  ) {}

  obterIniciais(nome: string): string {
    return nome.split(' ').map(p => p[0]).join('').toUpperCase();
  }

  abrirUploadFoto() {
    const input = document.getElementById('inputFoto') as HTMLInputElement;
    input.click();
  }

  selecionarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoSelecionada = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        // Atualiza avatar na sidebar
        this.userDataService.atualizarUsuario({ avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto() {
    this.fotoSelecionada = null;
    this.fotoPreviewUrl = null;
    this.userDataService.atualizarUsuario({ avatarUrl: null });
  }

  salvar() {
    this.editando = false;
    this.userDataService.atualizarUsuario({
      nome: this.usuario.nome,
      email: this.usuario.email,
      avatarUrl: this.fotoPreviewUrl ? this.fotoPreviewUrl.toString() : null
    });
  }

  atualizarSenha() {
    console.log('Senha atualizada:', this.novaSenha);
  }

  abrirConfirmacao() {
    this.exibindoConfirmacao = true;
  }

  fecharConfirmacao() {
    this.exibindoConfirmacao = false;
    this.confirmarExclusao = false;
    this.tentouExcluirSemCheckbox = false;
  }

  excluirConta() {
    if (!this.confirmarExclusao) {
      this.tentouExcluirSemCheckbox = true;
      return;
    }

    console.log('Conta excluída');
    this.fecharConfirmacao();
  }
}
