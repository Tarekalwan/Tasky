import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {  ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LocalAuthService } from '../../../core/services/local-auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink,  InputText, PasswordModule , ButtonModule, AutoCompleteModule ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  private auth = inject(LocalAuthService);
  private router = inject(Router);

  username = '';
  firstname = '';
  lastname  = '';
  email     = '';
  password  = '';

  // valeur choisie par l’autocomplete (string)
  status: 'etudiant' | 'salarie' | 'autre' | '' = '';

  // source et suggestions (strings → pas de 'field' requis)
  items = ['etudiant', 'salarie', 'autre'];
  suggestions = signal<string[]>(this.items);

  loading = signal(false);
  error   = signal<string | null>(null);

  search(event: { query: string }) {
    const q = (event?.query || '').toLowerCase();
    this.suggestions.set(
      this.items.filter(v => v.toLowerCase().includes(q))
    );
  }

  async onSignup() {
    this.loading.set(true); this.error.set(null);
    try {
      await this.auth.signup({
        username: this.username.trim(),
        firstname: this.firstname.trim(),
        lastname:  this.lastname.trim(),
        email:     this.email.trim(),
        password:  this.password,
        status:    (this.status || 'autre') // fallback
      });
      this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erreur lors de la création du compte');
    } finally {
      this.loading.set(false);
    }
  }
}
