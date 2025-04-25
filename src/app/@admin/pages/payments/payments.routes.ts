import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./payments.component')
  },
  {
    path: 'callback',
    loadComponent: () => import('./mp-oauth/mp-oauth.component')
  }
]; 