import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { MessageService } from '../../../../@core/services/snackbar.service';

@Component({
  selector: 'app-payment-pending',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    LucideModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg class="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Pago Pendiente</h2>
          <p class="mt-2 text-sm text-gray-600">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>
        </div>
        <div class="mt-8">
          <div class="rounded-md bg-gray-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-gray-900">Detalles del pago</h3>
                <div class="mt-2 text-sm text-gray-700">
                  <p>ID de pago: {{paymentId}}</p>
                  <p>Estado: {{status}}</p>
                  <p>Método de pago: {{paymentMethod}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <a
            routerLink="/"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentPendingComponent implements OnInit {
  paymentId: string = '';
  status: string = '';
  paymentMethod: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment_id'] || 'N/A';
      this.status = params['status'] || 'pending';
      this.paymentMethod = params['payment_method_id'] || 'N/A';
      
      // Mostrar mensaje de pendiente
      this.messageService.showWarning(
        'Tu pago está pendiente de confirmación',
        'bottom right',
        5000
      );
    });
  }
} 