import { Routes } from '@angular/router';

export const mpRoutes: Routes = [
    {
        path: 'failure',
        loadComponent: () =>
            import('./checkout-failure/checkout-failure.component').then(
                (m) => m.CheckoutFailureComponent
            ),
    },
    {
        path: 'success',
        loadComponent: () =>
            import('./checkout-success/checkout-success.component').then(
                (m) => m.CheckoutSuccessComponent
            ),
    },
];
