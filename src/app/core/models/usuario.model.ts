export interface Usuario {
  password: string;
  cpf: string;
  cnpj: string;
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  empresa: string;
  fotoUrl?: string;
}
