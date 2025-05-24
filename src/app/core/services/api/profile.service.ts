import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile.model';
import { Usuario } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  private getUserId(): number | null {
    const data = localStorage.getItem('usuario');
    const usuario: Usuario = data ? JSON.parse(data) : null;
    return usuario?.id || null;
  }

  private getHeaders(): HttpHeaders {
    const userId = this.getUserId();
    return new HttpHeaders({ 'x-user-id': userId?.toString() || '' });
  }

  obterDadosUsuarioLogado(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseUrl}/me/profile`, {
      headers: this.getHeaders()
    });
  }

  atualizarUsuario(profile: Partial<Profile>): Observable<any> {
    return this.http.put(`${this.baseUrl}/me/profile`, profile, {
      headers: this.getHeaders()
    });
  }

  atualizarSenha(dados: { senhaAtual: string; novaSenha: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/me/password`, dados, {
      headers: this.getHeaders()
    });
  }

  excluirConta(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  uploadFoto(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/photo`, formData);
  }
  cadastrarUsuario(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData);
  }
  getFoto(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/photo`, { responseType: 'blob' });
  }



}
