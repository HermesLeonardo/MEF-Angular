export class UploadedFile {
  constructor(
    public name: string,
    public type: string,
    public size: string,
    public date: Date,
    public category: string | null,
    public raw: File
  ) {}
}

export class StoredFile {
  static map(arg0: (sf: any) => UploadedFile): UploadedFile[] {
    throw new Error('Method not implemented.');
  }
  constructor(
    public name: string,
    public type: string,
    public sizeBytes: number,
    public date: string,
    public category: string | null,
    public content: string,
    public companyId: number
  ) {}
}
