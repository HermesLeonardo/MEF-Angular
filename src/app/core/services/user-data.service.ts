import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../core/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userSubject = new BehaviorSubject<Usuario>({
    id: 0,
    nome: '',
    email: '',
    password: '',
    cpf: '',
    cnpj: '',
    cargo: '',
    telefone: '',
    cpfCnpj: '',
    empresa: '',
    fotoUrl: ''
  });

  user$ = this.userSubject.asObservable();

  constructor() {
    const userJson = localStorage.getItem('usuario_logado');
    if (userJson) {
      const usuario: Usuario = JSON.parse(userJson);
      this.setUser(usuario);
    }
  }

  setUser(usuario: Usuario): void {
    this.userSubject.next(usuario);
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));
  }

  atualizarUsuario(parcial: Partial<Usuario>): void {
    const atual = this.userSubject.getValue();
    const atualizado = { ...atual, ...parcial };
    this.setUser(atualizado);
  }

  clearUser(): void {
    this.userSubject.next({
      id: 0,
      nome: '',
      email: '',
      password: '',
      cpf: '',
      cnpj: '',
      cargo: '',
      telefone: '',
      cpfCnpj: '',
      empresa: '',
      fotoUrl: ''
    });
    localStorage.removeItem('usuario_logado');
  }
}
