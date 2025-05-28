import { Injectable } from '@angular/core';
import { Company } from '../../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private storageKey = 'empresas';

  constructor() {}

  getCompanies(): Company[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getCompanyById(id: number): Company | undefined {
    return this.getCompanies().find(c => c.id === id);
  }

  createCompany(company: Company): void {
    const companies = this.getCompanies();
    companies.push(company);
    this.saveCompanies(companies);
  }

  updateCompany(id: number, updatedCompany: Company): void {
    const companies = this.getCompanies().map(company =>
      company.id === id ? { ...updatedCompany, updated_at: new Date().toISOString() } : company
    );
    this.saveCompanies(companies);
  }

  deleteCompany(id: number): void {
    const companies = this.getCompanies().filter(c => c.id !== id);
    this.saveCompanies(companies);
  }

  private saveCompanies(companies: Company[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(companies));
  }
}
