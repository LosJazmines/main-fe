import { Routes } from '@angular/router';
import { mpRoutes } from '@public-pages/mp/mp.routes';

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
        data: { breadcrumb: 'Online Store' },
      },
      {
        path: 'card-order',
        loadComponent: () =>
          import('./@public/pages/card-order/card-order.component').then(
            (m) => m.CardOrderComponent
          ),
        title: 'Los Jazmines - Card Order',
        data: { breadcrumb: 'Card Order' },
      },
      {
        path: 'card-order-map',
        loadComponent: () =>
          import(
            './@public/pages/card-order-map/card-order-map.component'
          ).then((m) => m.CardOrderMapComponent),
        title: 'Los Jazmines - Card Order Map',
        data: { breadcrumb: 'Card Order Map' },
      },

      {
        path: 'card-order-check-payments',
        loadComponent: () =>
          import(
            './@public/pages/card-order-check-payments-mp/card-order-check-payments-mp.component'
          ).then((m) => m.CardOrderCheckPaymentsMpComponent),
        title: 'Los Jazmines - Card Order Map',
        data: { breadcrumb: 'Card Order Map' },
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
        path: 'auth/google/callback',
        loadComponent: () =>
          import('./@public/pages/forms/google-callback/google-callback.component'),
        title: 'Los Jazmines - Google Callback',
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
      {
        path: 'payment/success',
        loadComponent: () =>
          import('./@public/pages/payment/success/success.component').then(
            (m) => m.PaymentSuccessComponent
          ),
        title: 'Los Jazmines - Payment Success',
      },
      {
        path: 'payment/failure',
        loadComponent: () =>
          import('./@public/pages/payment/failure/failure.component').then(
            (m) => m.PaymentFailureComponent
          ),
        title: 'Los Jazmines - Payment Failure',
      },
      {
        path: 'payment/pending',
        loadComponent: () =>
          import('./@public/pages/payment/pending/pending.component').then(
            (m) => m.PaymentPendingComponent
          ),
        title: 'Los Jazmines - Payment Pending',
      },
    ],
  },

  // @Rutas User
  {
    path: '',
    loadComponent: () =>
      import('./@user/pages/user.component').then((m) => m.UserComponent),
    title: 'User',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./@user/pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        title: 'User - Perfil',
      },
      {
        path: 'perfile',
        loadComponent: () =>
          import('./@user/pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        title: 'User - Perfil',
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./@user/pages/order/order-details/order-details.component').then(
            (m) => m.OrderDetailsComponent
          ),
        title: 'User - Order Details',
      },
    ],
  },

  // @Rutas Admin

  {
    path: 'a',
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
        path: 'products/:id',
        loadComponent: () => import('./@admin/pages/product/product.component'),
        title: 'Admin - Product',
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

  // @Rutar Mercado Pago
  {
    path: 'mp',
    children: mpRoutes,
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
