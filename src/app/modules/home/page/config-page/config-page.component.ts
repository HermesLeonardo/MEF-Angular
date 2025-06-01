import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../../../core/services/api/profile.service';
import { Profile } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css'],
  standalone: false,
})
export class ConfigPageComponent implements OnInit {
  tema: 'claro' | 'escuro' = 'escuro';
  animacoes = true;
  alertasSistema = true;
  mostrarTooltips = true;
  confirmacoesRapidas = false;

  formGroup: FormGroup;
  usuario: Profile | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', Validators.required],
      telefone: [''],
      cnpj: [''],
      role: [false],
      photo: [null],
    });
  }

  ngOnInit() {
    this.usuario = this.profileService.obterDadosUsuarioLogado(); 

  }


  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formGroup.patchValue({ photo: input.files[0] });
    }
  }

  cadastrarUsuario() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.onError('Erro ao enviar formulário');
      return;
    }

    const formData = new FormData();
    const value = this.formGroup.value;

    formData.append('name', value.name);
    formData.append('email', value.email);
    formData.append('password', value.password);
    formData.append('cpf', value.cpf);
    if (value.telefone) formData.append('telefone', value.telefone);
    if (value.cnpj) formData.append('cnpj', value.cnpj);
    formData.append('role', value.role ? 'admin' : 'user');
    if (value.photo) formData.append('photo', value.photo);

    this.profileService.cadastrarUsuario(formData);

    this.formGroup.reset();

    this.snackBar.open('✅ Usuário cadastrado com sucesso!', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });

    const usuario = this.profileService.obterDadosUsuarioLogado();
    if (usuario) {
      this.usuario = usuario;
    }

    console.log('Usuário salvo:', usuario);
  }

  togglePreferencia(nome: string, valor: boolean) {
    const acao = valor ? 'ativada' : 'desativada';
    this.snackBar.open(`Opção "${nome}" ${acao}`, 'Fechar', { duration: 2000 });
  }

  private onError(msg: string) {
    this.snackBar.open(msg, 'Fechar', { duration: 3000 });
  }

  errorMessage(campo: string): string {
    const c = this.formGroup.get(campo);
    if (c?.hasError('required')) return 'Campo obrigatório';
    if (c?.hasError('minlength')) return 'Mínimo de caracteres não atingido';
    if (c?.hasError('maxlength')) return 'Máximo de caracteres excedido';
    if (c?.hasError('email')) return 'Formato de email inválido';
    return 'Campo inválido';
  }
}
