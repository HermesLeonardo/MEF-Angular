import { Injectable } from '@angular/core';
import { Profile } from '../../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor() { }

  private getUsuario(): Profile | null {
    const data = localStorage.getItem('usuario_logado');
    return data ? JSON.parse(data) : null;
  }


  private salvarUsuario(usuario: Profile): void {
    localStorage.setItem('usuario_logado', JSON.stringify(usuario));

    const listaRaw = localStorage.getItem('usuarios');
    const lista: Profile[] = listaRaw ? JSON.parse(listaRaw) : [];


    const index = lista.findIndex((u: Profile) =>
      u.id === usuario.id || u.email === usuario.email
    );

    if (index !== -1) {
      lista[index] = usuario;
    } else {
      console.warn('[SalvarUsuario] Novo usuário foi adicionado (não encontrado por ID ou email)');
      lista.push(usuario);
    }

    localStorage.setItem('usuarios', JSON.stringify(lista));
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
    const listaUsuariosRaw = localStorage.getItem('usuarios') || '[]';

    if (!usuarioLogadoRaw || !listaUsuariosRaw) {
      console.warn('[SERVICE] Falha ao obter dados do localStorage');
      return;
    }

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
      console.log('[SERVICE] Lista de usuários atualizada');
    } else {
      console.warn('[SERVICE] Usuário não encontrado na lista de usuários');
    }
  }





  atualizarSenha(dados: { senhaAtual: string; novaSenha: string }): boolean {
    const usuarioAtual = this.getUsuario();
    if (!usuarioAtual) return false;

    const senhaArmazenada = (usuarioAtual.password || '').trim();
    const senhaInformada = (dados.senhaAtual || '').trim();

    if (senhaArmazenada !== senhaInformada) return false;

    usuarioAtual.password = dados.novaSenha.trim();
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
      const fotoBase64 = reader.result as string;
      usuario.photo = fotoBase64;

      // Salva no localStorage: usuario_logado + lista
      this.salvarUsuario(usuario);
      console.log('[Foto] Foto salva no usuário:', usuario);
    };

    reader.readAsDataURL(file);
  }


  cadastrarUsuario(formData: FormData): void {
    const fotoFile = formData.get('photo') as File | null;

    const criarUsuario = (fotoBase64: string | null) => {
      const novoUsuario: Profile = {
        id: Date.now(),
        nome: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        created_at: new Date(),
        photo: fotoBase64,
        telefone: formData.get('telefone') as string || null,
        cpf: formData.get('cpf') as string || null,
        cnpj: formData.get('cnpj') as string || null,
        role: formData.get('role') as string || 'user'
      };

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push(novoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      //localStorage.setItem('usuario_logado', JSON.stringify(novoUsuario));
    };

    if (fotoFile) {
      const reader = new FileReader();
      reader.onload = () => criarUsuario(reader.result as string);
      reader.readAsDataURL(fotoFile);
    } else {
      criarUsuario(null);
    }
  }



  getFoto(id: number): string | null {
    const usuario = this.getUsuario();
    if (!usuario || usuario.id !== id) return null;
    return usuario.photo;
  }




  deduplicarUsuarios(): void {
    const raw = localStorage.getItem('usuarios');
    if (!raw) return;

    const lista: Profile[] = JSON.parse(raw);

    // Elimina duplicatas mantendo o último de cada email
    const unicos: Map<string, Profile> = new Map();

    for (const u of lista) {
      unicos.set(u.email, u); // sobrescreve duplicados com mesmo email
    }

    const deduplicado = Array.from(unicos.values());
    localStorage.setItem('usuarios', JSON.stringify(deduplicado));
    console.log('[✔] Lista de usuários deduplicada:', deduplicado);
  }


}
