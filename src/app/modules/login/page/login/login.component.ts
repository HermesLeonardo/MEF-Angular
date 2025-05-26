import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/api/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDataService } from '../../../../core/services/user-data.service';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {

  cpfCnpj: string = '';
  senha: string = '';
  isLoading: boolean = false;
  formGroup!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userDataService: UserDataService
  ) {}
    ngOnInit(): void {
      this.formGroup = new FormBuilder().group({
        email: ['', [Validators.required, Validators.email,Validators.minLength(3), Validators.maxLength(50)]],
        senha: ['', [Validators.required,  Validators.minLength(3), Validators.maxLength(50)]]
      });
    }

  onSubmit() {
    if (this.formGroup.invalid) {
    this.formGroup.markAllAsTouched();
    this.snackBar.open('Preencha todos os campos!', 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['mat-warn']
    });
    return;
  }

  const { email, senha } = this.formGroup.value;
  this.isLoading = true;

    this.authService.login( email, senha).subscribe({
      next: (usuario: Usuario) => {
        this.authService.salvarUsuario(usuario);
        this.userDataService.setUser(usuario);
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        this.isLoading = false;
        
        this.snackBar.open('Email ou senha inválidos.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['mat-warn']
        });
      }
    });
  }

    private onError() {
    this.snackBar.open('Erro ao enviar formulário', 'Fechar', { duration: 3000 });
    }

    errorMessage(campo: string): string {
    const campoControl = this.formGroup.get(campo);

    if (campoControl?.hasError('email')) return 'E-mail Inválido!';
    if (campoControl?.hasError('required')) return 'Campo Obrigatório!';
    if (campoControl?.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (campoControl?.hasError('maxlength')) return 'Máximo 50 caracteres';

    return 'Erro desconhecido';
  }
}
