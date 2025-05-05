import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})


export class SidebarComponent implements OnInit {
  nome: string = '';
  email: string = '';
  avatarUrl: string | null = null;

  constructor(
    private userDataService: UserDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userDataService.user$.subscribe(user => {
      this.nome = user.nome;
      this.email = user.email;
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

}
