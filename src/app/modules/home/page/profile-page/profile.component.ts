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
    console.log('🔄 Iniciando carregamento do usuário...');

    this.profileService.obterDadosUsuarioLogado().subscribe({
      next: (data) => {
        console.log('Usuário recebido da API:', data);

        this.usuario = {
          id: data.id,
          name: data.name || 'N/A',
          email: data.email || 'N/A',
          password: data.password || 'N/A',
          cpf: data.cpf || 'N/A',
          telefone: data.telefone || 'N/A',
          photo: data.photo || null,
          role: data.role || 'N/A',
          created_at: data.created_at || new Date(),
        };

        console.log('this.usuario populado:', this.usuario);

        // Requisição separada para a foto, mantendo lógica atual
        if (this.usuario.photo) {
          this.profileService.getFoto(this.usuario.id).subscribe({
            next: (blob) => {
              const url = URL.createObjectURL(blob);
              this.fotoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            },
            error: () => {
              console.warn('⚠️ Falha ao carregar a imagem do usuário.');
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    });
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

      this.profileService.uploadFoto(this.usuario.id, formData).subscribe({
        next: () => {
          this.mostrarMensagem('Foto atualizada com sucesso.', 'success');
          this.atualizarDadosTextuais();
        },
        error: () => {
          this.mostrarMensagem('Erro ao atualizar a foto.', 'error');
        }
      });
    } else {
      this.atualizarDadosTextuais();
    }
  }

  salvarFoto() {
    if (this.fotoSelecionada) {
      const formData = new FormData();
      formData.append('photo', this.fotoSelecionada);

      this.profileService.uploadFoto(this.usuario.id, formData).subscribe({
        next: () => {
          this.mostrarMensagem('Foto atualizada com sucesso.', 'success');
          this.fotoSelecionada = null;
          this.carregarUsuario();
        },
        error: () => {
          this.mostrarMensagem('Erro ao atualizar a foto.', 'error');
        }
      });
    }
  }




  atualizarDadosTextuais() {
    const dadosAtualizados = {
      name: this.usuario.name,
      email: this.usuario.email,
      telefone: this.usuario.telefone,
      cpf: this.usuario.cpf
    };

    this.enviarAtualizacao(dadosAtualizados);
  }

  private enviarAtualizacao(dadosAtualizados: Partial<Profile>) {
    this.profileService.atualizarUsuario(dadosAtualizados).subscribe({
      next: () => {
        this.mostrarMensagem('Dados atualizados com sucesso!', 'success');
        this.editando = false;
        this.carregarUsuario();
      },
      error: () => this.mostrarMensagem('Erro ao atualizar os dados', 'error'),
    });
  }


  atualizarSenha() {
    if (this.novaSenha !== this.confirmarSenha) {
      this.mostrarMensagem('As senhas não coincidem', 'error');
      return;
    }

    this.profileService.atualizarSenha({
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha,
    }).subscribe({
      next: () => {
        this.mostrarMensagem('Senha atualizada com sucesso!', 'success');
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';
      },
      error: () => this.mostrarMensagem('Erro ao atualizar a senha', 'error'),
    });
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

    this.profileService.excluirConta().subscribe({
      next: () => {
        this.mostrarMensagem('Conta excluída com sucesso!', 'success');
        this.fecharConfirmacao();
        // redirecionamento ou logout
      },
      error: () => this.mostrarMensagem('Erro ao excluir conta', 'error'),
    });
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
}
