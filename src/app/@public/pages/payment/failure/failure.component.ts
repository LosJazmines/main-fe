import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { MessageService } from '../../../../@core/services/snackbar.service';

@Component({
  selector: 'app-payment-failure',
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
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Pago Fallido</h2>
          <p class="mt-2 text-sm text-gray-600">
            Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
          </p>
        </div>
        <div class="mt-8">
          <div class="rounded-md bg-gray-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-gray-900">Detalles del error</h3>
                <div class="mt-2 text-sm text-gray-700">
                  <p>ID de pago: {{paymentId}}</p>
                  <p>Estado: {{status}}</p>
                  <p>Mensaje: {{errorMessage}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex space-x-3">
          <a
            routerLink="/card-order"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Intentar nuevamente
          </a>
          <a
            routerLink="/"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentFailureComponent implements OnInit {
  paymentId: string = '';
  status: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['payment_id'] || 'N/A';
      this.status = params['status'] || 'rejected';
      this.errorMessage = params['error_message'] || 'No se pudo procesar el pago';
      
      // Mostrar mensaje de error
      this.messageService.showError(
        'El pago no pudo ser procesado',
        'bottom right',
        5000
      );
    });
  }
} 