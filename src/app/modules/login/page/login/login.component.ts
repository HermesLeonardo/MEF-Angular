import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/api/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDataService } from '../../../../core/services/user-data.service';
import { Profile } from '../../../../core/models/profile.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  cpfCnpj: string = '';
  senha: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.criarUsuarioPadraoSeNecessario();
  }

  criarUsuarioPadraoSeNecessario(): void {
    const usuariosRaw = localStorage.getItem('usuarios');
    const usuarios: Profile[] = usuariosRaw ? JSON.parse(usuariosRaw) : [];

    const adminExiste = usuarios.some(u => u.email === 'admin@admin.com');

    if (!adminExiste) {
      usuarios.push({
        id: 1,
        nome: 'Administrador',
        email: 'admin@admin.com',
        password: 'admin',
        created_at: new Date(),
        photo: null,
        telefone: '(00) 00000-0000',
        cpf: '00000000000',
        cnpj: '',
        role: 'admin'
      });

      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      console.log('Usuário admin@admin.com criado!');
    } else {
      console.log('Usuário admin já existe.');
    }
  }

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
