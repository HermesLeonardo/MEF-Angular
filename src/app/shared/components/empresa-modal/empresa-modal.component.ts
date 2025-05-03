import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-empresa-modal',
  standalone: false,
  templateUrl: './empresa-modal.component.html',
  styleUrl: './empresa-modal.component.css'
})
export class EmpresaModalComponent {
  empresaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmpresaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.empresaForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      responsavel: ['', Validators.required],
      type: ['company', Validators.required], // <- novo campo
      employeeCount: [0, Validators.required] // <- novo campo
    });
  }

  salvar() {
    if (this.empresaForm.valid) {
      console.log('Form enviado:', this.empresaForm.value);
      this.dialogRef.close(this.empresaForm.value); // <<< isso é essencial
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
