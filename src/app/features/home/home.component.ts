// src/app/features/home/home.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { LocalAuthService } from '../../core/services/local-auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ButtonModule],
  template: `
  <div class="card" style="text-align:center; padding:2rem; margin:auto; max-width:480px;">
    <h2>👋 Bienvenue, {{ user()?.firstname || user()?.username || 'Utilisateur' }} !</h2>
    <p-button label="Se déconnecter" (onClick)="logout()"></p-button>
  </div>`
})
export class HomeComponent {
  private auth = inject(LocalAuthService);
  private router = inject(Router);
  user = signal(this.auth.getCurrentUser());

  logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}
