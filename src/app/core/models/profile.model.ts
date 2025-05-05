export interface Profile {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  photo: string | null;
  telefone: string | null;
  cpf: string | null;
  role: string;
}
