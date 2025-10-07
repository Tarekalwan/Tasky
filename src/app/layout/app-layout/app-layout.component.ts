// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-app-layout',
//   imports: [],
//   templateUrl: './app-layout.component.html',
//   styleUrl: './app-layout.component.scss'
// })
// export class AppLayoutComponent {

// }


import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { LocalAuthService } from '../../core/services/local-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, PanelMenu, Avatar, Divider, ButtonModule, CommonModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {
  private router = inject(Router);
  private auth = inject(LocalAuthService);

  user = this.auth.getCurrentUser();
  items: MenuItem[] = [
    { label: 'Accueil', icon: 'pi pi-home', routerLink: '/home' },
    { label: 'Profil', icon: 'pi pi-user', routerLink: '/profile' },
  ];

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
