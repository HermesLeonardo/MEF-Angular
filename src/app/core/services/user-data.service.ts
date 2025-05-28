import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userSubject = new BehaviorSubject<Profile>({
    id: 0,
    nome: '',
    email: '',
    password: '',
    created_at: new Date(),
    photo: null,
    telefone: null,
    cpf: null,
    cnpj: null,
    role: 'user'
  });

  user$ = this.userSubject.asObservable();

  constructor() {
    const userJson = localStorage.getItem('usuario_logado');
    if (userJson) {
      const usuario: Profile = JSON.parse(userJson);
      this.setUser(usuario);
    }
  }

  setUser(usuario: Profile): void {
    this.userSubject.next(usuario);
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));
  }

  atualizarUsuario(parcial: Partial<Profile>): void {
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
      created_at: new Date(),
      photo: null,
      telefone: null,
      cpf: null,
      cnpj: null,
      role: 'user'
    });
    localStorage.removeItem('usuario_logado');
  }
}
