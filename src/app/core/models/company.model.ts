export interface Company {
    id: number;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    responsible_name: string;
    address: string;
    status: string;
    created_at: string;
    funci_quanti?: number; // número de funcionários (opcional, pois não sei se sempre vem)
  }
  