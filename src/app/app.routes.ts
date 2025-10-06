import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';


export const routes: Routes = [
  { path: 'login',  loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'home',   loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];


