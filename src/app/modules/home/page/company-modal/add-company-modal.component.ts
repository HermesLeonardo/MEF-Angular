import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../../core/services/api/company.service';
import { Company } from '../../../../core/models/company.model';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.css'],
  standalone: false,
})
export class AddCompanyModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() companyAdded = new EventEmitter<void>();

  form: FormGroup;
  selectedType: 'cpf' | 'cnpj' = 'cpf';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      document: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)]],
      responsible: ['', Validators.required],
      address: ['', Validators.required],
      funci_quanti: [0, [Validators.required, Validators.min(0)]],
    });

  }

  setType(type: 'cpf' | 'cnpj') {
    this.selectedType = type;
  }

  submit() {
    if (this.form.invalid) return;

      const novaEmpresa: Company = {
        id: Date.now(), // ID único com timestamp
        name: this.form.value.name,
        cnpj: this.selectedType === 'cnpj' ? this.form.value.document : '',
        cpf: this.selectedType === 'cpf' ? this.form.value.document : '',
        email: this.form.value.email,
        phone: this.form.value.phone || '',
        responsible: this.form.value.responsible || '',
        address: this.form.value.address || '',
        status: 'ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        funci_quanti: this.form.value.funci_quanti || 0
      };


    this.companyService.createCompany(novaEmpresa);

    this.companyAdded.emit();
    this.close.emit();
  }
}
