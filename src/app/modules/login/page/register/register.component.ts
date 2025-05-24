import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    console.log('Cadastro enviado:', this.registerForm.value);
  }

  getErroCampo(campo: string): string | null {
    const campoControl = this.registerForm.get(campo);
    if (!campoControl || !campoControl.errors || !campoControl.touched) return null;

    if (campoControl.hasError('required')) return 'Campo obrigatório';
    if (campoControl.hasError('email')) return 'Formato de e-mail inválido';
    if (campoControl.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (campoControl.hasError('maxlength')) return 'Máximo 50 caracteres';

    return null;
  }
}
