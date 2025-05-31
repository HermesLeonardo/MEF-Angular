import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Company } from '../../../../core/models/company.model';

@Component({
  standalone: false,
  selector: 'app-company-detail-modal',
  templateUrl: './company-detail-modal.component.html',
  styleUrls: ['./company-detail-modal.component.css'],
})
export class CompanyDetailModalComponent implements OnInit {
  form!: FormGroup;
  formDisabled = true;
  showSaveButton = false;
  tipoDocumento: 'cpf' | 'cnpj' = 'cpf';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { company: Company },
    private dialogRef: MatDialogRef<CompanyDetailModalComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const c = this.data.company;

    this.tipoDocumento = !!c.cnpj ? 'cnpj' : 'cpf';

    this.form = this.fb.group({
      name: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      document: [{ value: '', disabled: true }, [Validators.required]],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      phone: [{ value: '', disabled: true }, [Validators.required]],
      responsible: [{ value: '', disabled: true }, [Validators.required]],
      address: [{ value: '', disabled: true }, [Validators.required]],
      funci_quanti: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
    });

    this.form.patchValue({
      name: c.name || '',
      document: c.cnpj || c.cpf || '',
      email: c.email || '',
      phone: c.phone || '',
      responsible: c.responsible || '',
      address: c.address || '',
      funci_quanti: c.funci_quanti ?? 0,
    });
  }

  enableEdit() {
    this.formDisabled = false;
    this.showSaveButton = true;
    this.form.enable();
  }

  saveChanges() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const updatedCompany: Company = {
      ...this.data.company,
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      responsible: formValue.responsible,
      address: formValue.address,
      funci_quanti: formValue.funci_quanti,
      updated_at: new Date().toISOString(),
      cpf: this.tipoDocumento === 'cpf' ? formValue.document : '',
      cnpj: this.tipoDocumento === 'cnpj' ? formValue.document : '',
    };

    const storedCompanies: Company[] = JSON.parse(
      localStorage.getItem('companies') || '[]'
    );
    const index = storedCompanies.findIndex((c) => c.id === updatedCompany.id);
    if (index !== -1) {
      storedCompanies[index] = updatedCompany;
      localStorage.setItem('companies', JSON.stringify(storedCompanies));
    }

    this.snackBar.open('Empresa atualizada com sucesso!', 'Fechar', {
      duration: 3000,
    });

    this.dialogRef.close();
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
