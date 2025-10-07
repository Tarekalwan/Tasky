// import { Routes } from '@angular/router';
// import { HomeComponent } from './features/home/home.component';


// export const routes: Routes = [
//   { path: 'login',  loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
//   { path: 'signup', loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent) },
//   { path: 'home',   loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: '**', redirectTo: 'login' }
// ];


import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Authentification
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },

  // Zone protégée (avec layout)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'home' }
    ]
  },

  // Redirection par défaut
  { path: '**', redirectTo: '' }
];
