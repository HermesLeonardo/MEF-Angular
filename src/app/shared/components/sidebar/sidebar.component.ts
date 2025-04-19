import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';

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

  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.userDataService.user$.subscribe(user => {
      this.nome = user.nome;
      this.email = user.email;
      this.avatarUrl = user.avatarUrl;
    });
  }
}
