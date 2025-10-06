import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { LocalAuthService } from '../../../core/services/local-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, InputText ,PasswordModule , ButtonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private auth = inject(LocalAuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async onLogin() {
    this.loading.set(true); this.error.set(null);
    try {
      await this.auth.login(this.username.trim(), this.password);
      this.router.navigateByUrl('/home');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erreur de connexion');
    } finally {
      this.loading.set(false);
    }
  }
}
