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

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userDataService: UserDataService
  ) {}

  onSubmit(cpfCnpj: string, senha: string) {
    if (!cpfCnpj || !senha) {
      this.snackBar.open('Preencha todos os campos!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['mat-warn']
      });
      return;
    }

    this.isLoading = true;

    const sucesso = this.authService.login(cpfCnpj, senha);

    if (sucesso) {
      const usuario = this.authService.obterUsuario();
      if (usuario) {
        this.userDataService.setUser(usuario);
        this.router.navigate(['/home']);
      }
    } else {
      this.snackBar.open('E-mail ou senha inválidos.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['mat-warn']
      });
    }

    this.isLoading = false;
  }
}
