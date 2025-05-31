export class UploadedFile {
  editing?: boolean;
  editingName?: string;
  editingCategory?: string | null;

  constructor(
    public id: string,
    public name: string,
    public type: string,
    public size: string,
    public date: Date,
    public category: string | null,
    public raw: File,
    public status: 'Ativo' | 'Inativo' = 'Ativo' // ← agora parte do constructor
  ) { }
}

export class StoredFile {
  static map(arg0: (sf: any) => UploadedFile): UploadedFile[] {
    throw new Error('Method not implemented.');
  }

  constructor(
    public id: string,
    public name: string,
    public type: string,
    public sizeBytes: number,
    public date: string,
    public category: string | null,
    public content: string,
    public companyId: number,
    public status: 'Ativo' | 'Inativo' = 'Ativo' // ← novo campo persistido
  ) { }
}

export class RecentFile extends UploadedFile {
  constructor(
    public override id: string,
    name: string,
    type: string,
    size: string,
    date: string, // ← continua como string aqui
    category: string | null,
    raw: File,
    public destination: string,
    public override status: 'Ativo' | 'Inativo',
    public companyId: number
  ) {
    super(id, name, type, size, new Date(date), category ?? null, raw, status);
  }
}

