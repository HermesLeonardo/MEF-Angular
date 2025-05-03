import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Empresa {
  id?: number; // <-- agora tem id!
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  responsavel: string;
  type: 'company' | 'client'; // novo campo
  employeeCount: number; // novo campo
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private empresasSubject = new BehaviorSubject<Empresa[]>([]);
  empresas$ = this.empresasSubject.asObservable();

  private currentId = 1; // <-- contador de ID

  adicionarEmpresa(empresa: Empresa) {
    const novaEmpresa: Empresa = {
      ...empresa,
      id: this.currentId++ // <-- atribui ID único
    };
    const empresasAtuais = this.empresasSubject.value;
    this.empresasSubject.next([...empresasAtuais, novaEmpresa]);
  }

  getEmpresas(): Empresa[] {
    return this.empresasSubject.value;
  }
}
