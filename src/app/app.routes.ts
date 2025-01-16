import { Routes } from '@angular/router';

export const routes: Routes = [
  // @Rutas Public
  {
    path: '',
    loadComponent: () => import('./@public/pages/public.component'),
    title: 'LosJazmines',
    children: [
      {
        path: '',
        loadComponent: () => import('./@public/pages/home/home.component'),
        title: 'Los Jazmines - Home',
      },
      {
        path: 'home',
        loadComponent: () => import('./@public/pages/home/home.component'),
        title: 'Los Jazmines - Home',
      },
      {
        path: 'online-store',
        loadComponent: () =>
          import('./@public/pages/online-store/online-store.component'),
        title: 'Los Jazmines - Online Store',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./@public/pages/forms/register/register.component'),
        title: 'Los Jazmines - Register',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./@public/pages/forms/login/login.component'),
        title: 'Los Jazmines - Login',
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./@public/pages/forms/checkout/checkout.component'),
        title: 'Los Jazmines - Checkout',
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import(
            './@public/pages/forms/change-password/change-password.component'
          ),
        title: 'Los Jazmines - Change Password',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./@public/pages/contact/contact.component'),
        title: 'Los Jazmines - Contact',
      },

      {
        path: 'about',
        loadComponent: () => import('./@public/pages/about/about.component'),
        title: 'Los Jazmines - About',
      },
    ],
  },

  // @Rutas Admin

  {
    path: 'admin',
    loadComponent: () => import('./@admin/pages/admin.component'),
    title: 'Admin',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./@admin/pages/dashboard/dashboard.component'),
        title: 'Admin - Dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./@admin/pages/dashboard/dashboard.component'),
        title: 'Admin - Dashboard',
      },
      {
        path: 'orders',
        loadComponent: () => import('./@admin/pages/ordes/ordes.component'),
        title: 'Admin - Ordes',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./@admin/pages/products/products.component'),
        title: 'Admin - Products',
      },
      {
        path: 'users',
        loadComponent: () => import('./@admin/pages/users/users.component'),
        title: 'Admin - Users',
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./@admin/pages/payments/payments.component'),
        title: 'Admin - Payments',
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
