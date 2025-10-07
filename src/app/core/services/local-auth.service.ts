
import { Injectable, signal } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';

export interface LocalUser {
  id: string;
  username: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  status?: string;
  created_at?: string;
}

function safeParseUser(raw: string | null): LocalUser | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && 'id' in obj && 'username' in obj) return obj as LocalUser;
  } catch {}
  localStorage.removeItem('tasky_user');
  return null;
}

@Injectable({ providedIn: 'root' })
export class LocalAuthService {
  private _user = signal<LocalUser | null>(null);
  user = this._user.asReadonly();

  constructor(private sb: SupabaseClientService) {
    this._user.set(safeParseUser(localStorage.getItem('tasky_user')));
  }

  /** 🔐 Inscription via RPC (hash bcrypt côté DB) */
  async signup(u: {
    username: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    status?: string;
    password: string;
  }) {
    const { data, error } = await this.sb.supabase.rpc('signup_user', {
      p_username:  u.username,
      p_firstname: u.firstname ?? null,
      p_lastname:  u.lastname ?? null,
      p_email:     u.email ?? null,
      p_status:    u.status ?? 'autre',
      p_password:  u.password
    });

    if (error || !data?.[0]) throw new Error(error?.message ?? 'Création impossible');
    const user = data[0] as LocalUser;
    this._user.set(user);
    localStorage.setItem('tasky_user', JSON.stringify(user));
    return user;
  }

  /** 🔑 Connexion via RPC (vérif bcrypt côté DB) */
  async login(username: string, password: string) {
    const { data, error } = await this.sb.supabase.rpc('login_user', {
      p_username: username,
      p_password: password
    });

    if (error || !data?.[0]) throw new Error('Identifiants invalides');
    const user = data[0] as LocalUser;
    this._user.set(user);
    localStorage.setItem('tasky_user', JSON.stringify(user));
    return user;
  }

  getCurrentUser() { return this._user(); }
  logout() { this._user.set(null); localStorage.removeItem('tasky_user'); }
  isLoggedIn() { return !!this._user(); }
}

