import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./public.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component'),
        title: 'Home',
        data: { breadcrumb: 'Home' }
      },
      {
        path: 'register',
        loadComponent: () => import('./forms/register/register.component'),
      },
      {
        path: 'login',
        loadComponent: () => import('./forms/login/login.component'),
      },
      {
        path: 'checkout',
        loadComponent: () => import('./forms/checkout/checkout.component'),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./forms/change-password/change-password.component'),
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component'),
      },
    ],
  },
];
