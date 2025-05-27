import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  login(cpfCnpj: string, senha: string): boolean {
    console.log('Verificando login com:', { email: cpfCnpj, password: senha });

    const usuarios: Profile[] = JSON.parse(localStorage.getItem('usuarios') || '[]');

    // Adiciona esse log para verificar os usuários cadastrados no localStorage
    console.log('Usuários salvos no localStorage:', usuarios);

    const usuario = usuarios.find(
      u =>
        (u.email === cpfCnpj || u.cpf === cpfCnpj || u.cnpj === cpfCnpj) &&
        u.password === senha
    );

    if (usuario) {
      localStorage.setItem('usuario_logado', JSON.stringify(usuario));
      return true;
    }

    return false;
  }

  obterUsuario(): Profile | null {
    const data = localStorage.getItem('usuario_logado');
    return data ? JSON.parse(data) : null;
  }


  logout(): void {
    localStorage.removeItem('usuario_logado');
  }
}
