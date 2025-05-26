import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor() { }

  private getUsuario(): Profile | null {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  private salvarUsuario(usuario: Profile): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUserId(): number | null {
    return this.getUsuario()?.id || null;
  }

  obterDadosUsuarioLogado(): Profile | null {
    const data = localStorage.getItem('usuario_logado');
    return data ? JSON.parse(data) : null;
  }


atualizarUsuario(profile: Partial<Profile>): void {
  const usuarioLogadoRaw = localStorage.getItem('usuario_logado');
  const listaUsuariosRaw = localStorage.getItem('usuarios');

  if (!usuarioLogadoRaw || !listaUsuariosRaw) return;

  const usuarioLogado: Profile = JSON.parse(usuarioLogadoRaw);
  const usuarios: Profile[] = JSON.parse(listaUsuariosRaw);

  const atualizado: Profile = {
    ...usuarioLogado,
    ...profile
  };


  localStorage.setItem('usuario_logado', JSON.stringify(atualizado));


  const index = usuarios.findIndex(u => u.id === atualizado.id);
  if (index !== -1) {
    usuarios[index] = atualizado;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
}




  atualizarSenha(dados: { senhaAtual: string; novaSenha: string }): boolean {
    const usuarioAtual = this.getUsuario();
    if (!usuarioAtual) return false;

    if (usuarioAtual.password !== dados.senhaAtual) return false;

    usuarioAtual.password = dados.novaSenha;
    this.salvarUsuario(usuarioAtual);
    return true;
  }

  excluirConta(): void {
    localStorage.removeItem('usuario');
  }

  uploadFoto(id: number, formData: FormData): void {
    const usuario = this.getUsuario();
    if (!usuario || usuario.id !== id) return;

    const file = formData.get('foto') as File;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      usuario.photo = reader.result as string;
      this.salvarUsuario(usuario);
    };

    reader.readAsDataURL(file); // Converte imagem para base64
  }

  cadastrarUsuario(formData: FormData): void {
    const novoUsuario: Profile = {
      id: Date.now(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      created_at: new Date(),
      photo: null,
      telefone: formData.get('telefone') as string || null,
      cpf: formData.get('cpf') as string || null,
      cnpj: formData.get('cnpj') as string || null,
      role: formData.get('role') as string || 'user'
    };

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }


  getFoto(id: number): string | null {
    const usuario = this.getUsuario();
    if (!usuario || usuario.id !== id) return null;
    return usuario.photo;
  }
}
