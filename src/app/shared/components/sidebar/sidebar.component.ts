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
  ) { }


  ngOnInit(): void {
    this.userDataService.user$.subscribe(user => {
      this.nome = user.nome;
      this.email = user.email;
    });

    this.userDataService.user$.subscribe(user => {
      this.nome = user.nome;
      this.email = user.email;

      if (user.id) {
        this.profileService.getFoto(user.id).subscribe({
          next: (blob) => {
            const url = URL.createObjectURL(blob);
            this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(url);
          },
          error: () => {
            this.avatarUrl = null;
          }
        });
      }
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
