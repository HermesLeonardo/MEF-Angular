export interface Company {
  id: number; // ← gerado no backend
  name: string;
  cnpj: string;
  cpf: string; // opcional, pois pode ser que não venha
  email: string;
  phone: string;
  responsible: string;
  address: string;
  status: string;
  created_at: string; 
  updated_at: string; 
  funci_quanti?: number; 
}
