import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../core/services/user-data.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProfileService } from '../../../core/services/api/profile.service';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  nome: string = '';
  email: string = '';
  avatarUrl: SafeUrl | null = null;

  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.userDataService.user$.subscribe(user => {
      this.nome = user.nome;
      this.email = user.email;

      if (user.id) {
        const fotoBase64 = this.profileService.getFoto(user.id);

        if (fotoBase64) {
          this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(fotoBase64);
        } else {
          this.avatarUrl = null;
        }
      }
    });
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
  localStorage.removeItem('usuario_logado');
  this.router.navigate(['/login']);
}

}
