import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '../../../../core/models/profile.model';
import { ProfileService } from '../../../../core/services/api/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  usuario: Profile = {} as Profile;
  fotoPreviewUrl: SafeUrl | null = null;
  fotoSelecionada: File | null = null;

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  editando = false;
  exibindoConfirmacao = false;
  confirmarExclusao = false;
  tentouExcluirSemCheckbox = false;

  formGroup: FormGroup;
  isDev: any;

  constructor(
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      telefone: [''],
      role: ['user']
    });
  }

  ngOnInit(): void {
    this.carregarUsuario();
  }

  carregarUsuario(): void {
    const data = this.profileService.obterDadosUsuarioLogado();

    if (!data) {
      console.warn('Usuário não encontrado no localStorage.');
      return;
    }

    this.usuario = { ...data };

    this.formGroup.patchValue({
      nome: data.nome,
      email: data.email,
      cpf: data.cpf,
      telefone: data.telefone,
      role: data.role
    });

    if (data.photo) {
      this.fotoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(data.photo);
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
    this.profileService.deduplicarUsuarios();
  }

  salvar() {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.cpf) {
      this.mostrarMensagem('Preencha os campos corretamente.', 'error');
      return;
    }

    if (this.fotoSelecionada) {
      const formData = new FormData();
      formData.append('photo', this.fotoSelecionada);
      this.profileService.uploadFoto(this.usuario.id, formData);
    }

    this.profileService.atualizarUsuario(this.usuario); // Aqui usamos o objeto que o ngModel está editando

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
      this.mostrarMensagem('Senha atual incorreta.', 'error');
    }
  }

  excluirConta() {
    if (!this.confirmarExclusao) {
      this.tentouExcluirSemCheckbox = true;
      return;
    }

    this.profileService.excluirConta();
    this.mostrarMensagem('Conta excluída com sucesso!', 'success');
    this.fecharConfirmacao();
  }

  alternarEdicao() {
    this.editando = !this.editando;
    if (this.editando) {
      this.mostrarMensagem('Modo de edição ativado', 'info');
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
    const checked = (event.target as HTMLInputElement).checked;
    const novaRole = checked ? 'admin' : 'user';

    // Atualiza o objeto usado no salvar()
    this.usuario.role = novaRole;

    // Se estiver usando também formGroup para outros fins
    this.formGroup.patchValue({ role: novaRole });
  }


  formatarCPF(cpf: string): string {
    if (!cpf || cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarCPFVisual(cpf: string | null): string {
    if (!cpf) return 'N/A';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private mostrarMensagem(mensagem: string, tipo: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${tipo}`],
    });
  }

  onRoleToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.formGroup.patchValue({ role: checked ? 'admin' : 'user' });
  }


  deduplicar(): void {
    this.profileService.deduplicarUsuarios();
    this.snackBar.open('Deduplicação concluída.', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }


}
