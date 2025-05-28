
export interface Profile {
  id: number;
  nome: string;
  email: string;
  password: string;
  created_at: Date;
  photo: string | null;
  telefone: string | null;
  cpf: string | null;
  cnpj: string | null;
  role: string;
}
