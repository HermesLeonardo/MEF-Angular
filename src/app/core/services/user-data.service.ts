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
    cargo: '',
    telefone: '',
    cpfCnpj: '',
    empresa: '',
    fotoUrl: ''
  });

  user$ = this.userSubject.asObservable();

  constructor() {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const usuario: Usuario = JSON.parse(userJson);
      this.setUser(usuario);
    }
  }

  setUser(usuario: Usuario) {
    this.userSubject.next(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  atualizarUsuario(parcial: Partial<Usuario>) {
    const atual = this.userSubject.getValue();
    const atualizado = { ...atual, ...parcial };
    this.setUser(atualizado);
  }

  clearUser() {
    this.userSubject.next({
      id: 0,
      nome: '',
      email: '',
      cargo: '',
      telefone: '',
      cpfCnpj: '',
      empresa: '',
      fotoUrl: ''
    });
    localStorage.removeItem('usuario');
  }
}
