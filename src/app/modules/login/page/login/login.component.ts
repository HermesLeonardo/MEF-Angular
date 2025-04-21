import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false

})
export class LoginComponent {
  cpfCnpj: string = '';
  senha: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onSubmit(cpfCnpj: string, senha: string) {
    if (!cpfCnpj || !senha) {
      alert('Preencha todos os campos');
      return;
    }
  
    this.isLoading = true;
  
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
  
}
