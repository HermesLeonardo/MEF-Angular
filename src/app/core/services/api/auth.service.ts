import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users/login';

  constructor(private http: HttpClient) {}

  login(cpfCnpj: string, senha: string): Observable<Usuario> {
    console.log('Chamando API de login com:', { email: cpfCnpj, password: senha });
    return this.http.post<Usuario>(this.apiUrl, {
      email: cpfCnpj,
      password: senha
    });
  }
  
  salvarUsuario(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obterUsuario(): Usuario | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  logout() {
    localStorage.removeItem('usuario');
  }
}
