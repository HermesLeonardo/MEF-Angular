import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private userSubject = new BehaviorSubject<any>({
    nome: 'João Silva',
    email: 'joao.silva@escritoriox.com',
    avatarUrl: null
  });

  user$ = this.userSubject.asObservable();

  atualizarUsuario(dados: any) {
    const atual = this.userSubject.value;
    this.userSubject.next({ ...atual, ...dados });
  }
}
