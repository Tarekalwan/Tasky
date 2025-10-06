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
    // micro-validation
    if (obj && typeof obj === 'object' && 'id' in obj && 'username' in obj) {
      return obj as LocalUser;
    }
  } catch {
    // si la valeur était "undefined" / JSON invalide
  }
  // si invalide → on nettoie la clé
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

  async signup(user: Partial<LocalUser> & { password: string }) {
    const { data, error } = await this.sb.supabase
      .from('users')
      .insert(user)
      .select('*')
      .single();
    if (error || !data) throw new Error(error?.message || 'Création impossible');
    this._user.set(data);
    localStorage.setItem('tasky_user', JSON.stringify(data));
    return data;
  }

  async login(username: string, password: string) {
    const { data, error } = await this.sb.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    if (error || !data) throw new Error('Identifiants invalides');
    this._user.set(data);
    localStorage.setItem('tasky_user', JSON.stringify(data));
    return data;
  }

  getCurrentUser() {
    return this._user();
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('tasky_user');
  }

  isLoggedIn() { return !!this._user(); }
}
