import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../../../../core/models/profile.model';
import { ProfileService } from '../../../../core/services/api/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  usuario: Profile = {} as Profile;
  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';
  editando = false;

  fotoSelecionada: File | null = null;
  fotoPreviewUrl: SafeUrl | null = null;

  exibindoConfirmacao = false;
  confirmarExclusao = false;
  tentouExcluirSemCheckbox = false;

  constructor(
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.carregarUsuario();
  }

  carregarUsuario(): void {
    const data = this.profileService.obterDadosUsuarioLogado();

    if (!data) {
      console.warn('Usuário não encontrado no localStorage.');
      return;
    }

    this.usuario = {
      id: data.id,
      name: data.name || 'N/A',
      email: data.email || 'N/A',
      password: data.password || 'N/A',
      cpf: data.cpf || 'N/A',
      telefone: data.telefone || 'N/A',
      photo: data.photo || null,
      role: data.role || 'N/A',
      created_at: new Date(data.created_at),
      cnpj: data.cnpj || null,
    };

    if (this.usuario.photo) {
      this.fotoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(this.usuario.photo);
    }
  }

  obterIniciais(nome: string | undefined): string {
    if (!nome) return '';
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
        this.mostrarMensagem('Foto selecionada com sucesso!', 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto() {
    this.fotoSelecionada = null;
    this.fotoPreviewUrl = null;
    this.mostrarMensagem('Foto de perfil removida', 'info');
  }

  salvar() {
    if (this.fotoSelecionada) {
      const formData = new FormData();
      formData.append('photo', this.fotoSelecionada);
      this.profileService.uploadFoto(this.usuario.id, formData);
      this.mostrarMensagem('Foto atualizada com sucesso.', 'success');
    }

    this.atualizarDadosTextuais();
  }

atualizarDadosTextuais() {
  const dadosAtualizados = {
    name: this.usuario.name,
    email: this.usuario.email,
    telefone: this.usuario.telefone,
    cpf: this.usuario.cpf,
    role: this.usuario.role  
  };

  this.profileService.atualizarUsuario(dadosAtualizados);
  this.mostrarMensagem('Dados atualizados com sucesso!', 'success');
  this.editando = false;
  this.carregarUsuario();
}


  atualizarSenha() {
    if (this.novaSenha !== this.confirmarSenha) {
      this.mostrarMensagem('As senhas não coincidem', 'error');
      return;
    }

    const sucesso = this.profileService.atualizarSenha({
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha,
    });

    if (sucesso) {
      this.mostrarMensagem('Senha atualizada com sucesso!', 'success');
      this.senhaAtual = '';
      this.novaSenha = '';
      this.confirmarSenha = '';
    } else {
      this.mostrarMensagem('Erro ao atualizar a senha', 'error');
    }
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

    this.profileService.excluirConta();
    this.mostrarMensagem('Conta excluída com sucesso!', 'success');
    this.fecharConfirmacao();
    // redirecionamento ou logout pode ir aqui
  }

  alternarEdicao() {
    this.editando = !this.editando;
    if (this.editando) {
      this.mostrarMensagem('Modo de edição ativado', 'info');
    }
  }

  private mostrarMensagem(mensagem: string, tipo: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${tipo}`],
    });
  }

  salvarFoto(): void {
    if (this.fotoSelecionada) {
      const formData = new FormData();
      formData.append('photo', this.fotoSelecionada);

      this.profileService.uploadFoto(this.usuario.id, formData);
      this.mostrarMensagem('Foto atualizada com sucesso.', 'success');

      this.fotoSelecionada = null;
      this.carregarUsuario();
    } else {
      this.mostrarMensagem('Nenhuma foto selecionada.', 'error');
    }
  }

  onRoleCheckboxChange(event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  this.usuario.role = checkbox.checked ? 'admin' : 'user';
}


}
