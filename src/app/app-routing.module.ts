import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentErrorComponent } from './@shared/components/payment-error/payment-error.component';

const routes: Routes = [
  {
    path: 'payment-error',
    component: PaymentErrorComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 