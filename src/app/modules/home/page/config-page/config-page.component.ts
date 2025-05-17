import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../../../core/services/api/profile.service';



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

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private profileService: ProfileService) {


    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', Validators.required],
      telefone: [''],
      role: [false],
      photo: [null],
    });


  }

  ngOnInit() {
    this.alterarTema(this.tema);
  }

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
    formData.append('role', value.role ? 'admin' : 'user');
    if (value.photo) formData.append('photo', value.photo);

    this.profileService.cadastrarUsuario(formData).subscribe({
      next: () => this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', { duration: 3000 }),
      error: () => this.onError('Erro ao cadastrar usuário')
    });

    this.formGroup.reset();
  }

  // Preferência com feedback
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
