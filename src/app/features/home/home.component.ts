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
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private auth = inject(LocalAuthService);
  private router = inject(Router);
  user = signal(this.auth.getCurrentUser());

  logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}
