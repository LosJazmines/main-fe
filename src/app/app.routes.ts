import { Routes } from '@angular/router';

export const routes: Routes = [
  // @Rutas Public
  {
    path: '',
    loadComponent: () => import('./@public/pages/public.component'),
    children: [
      {
        path: '',
        loadComponent: () => import('./@public/pages/home/home.component'),
        title: 'Home',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./@public/pages/forms/register/register.component'),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./@public/pages/forms/login/login.component'),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./@public/pages/forms/checkout/checkout.component'),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import(
            './@public/pages/forms/change-password/change-password.component'
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./@public/pages/contact/contact.component'),
      },
    ],
  },

  // @Rutas Admin

  {
    path: 'admin',
    loadComponent: () => import('./@admin/pages/admin.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./@admin/pages/dashboard/dashboard.component'),
        title: 'Dashboard',
      },
      {
        path: 'ordes',
        loadComponent: () => import('./@admin/pages/ordes/ordes.component'),
        title: 'Ordes',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./@admin/pages/products/products.component'),
        title: 'Products',
      },
      {
        path: 'users',
        loadComponent: () => import('./@admin/pages/users/users.component'),
        title: 'Users',
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./@admin/pages/payments/payments.component'),
        title: 'Payments',
      },
    ],
  },

  // @Rutas vacias y rutas comodín
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
