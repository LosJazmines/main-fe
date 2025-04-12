import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './snackbar.service';
import { MercadoPagoService } from './mercado-pago.service';

export interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  picture_url?: string;
}

export interface PaymentPreference {
  items: PaymentItem[];
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
    address?: {
      street_name?: string;
      street_number?: number;
      zip_code?: string;
    };
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  statement_descriptor?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private mercadoPagoService: MercadoPagoService
  ) {}

  /**
   * Create a payment preference
   */
  createPaymentPreference(preference: PaymentPreference): Observable<any> {
    // In a real implementation, you would call the MercadoPago API to create a payment preference
    // For now, we'll just return a mock response
    return of({
      id: 'mock-preference-id',
      init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-preference-id',
      sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-preference-id'
    }).pipe(
      tap(() => {
        this.messageService.showInfo(
          'Preferencia de pago creada correctamente',
          'top center'
        );
      }),
      catchError(error => {
        this.messageService.showError(
          'Error al crear preferencia de pago: ' + error.message,
          'top center'
        );
        throw error;
      })
    );
  }

  /**
   * Process a payment
   */
  processPayment(paymentData: any): Observable<any> {
    // In a real implementation, you would call the MercadoPago API to process a payment
    // For now, we'll just return a mock response
    return of({
      id: 'mock-payment-id',
      status: 'approved',
      status_detail: 'accredited',
      transaction_details: {
        transaction_id: 'mock-transaction-id',
        payment_method_reference_id: 'mock-reference-id',
        total_paid_amount: paymentData.transaction_amount,
        installment_amount: paymentData.transaction_amount,
        external_resource_url: 'https://www.mercadopago.com.ar/payments/mock-payment-id'
      }
    }).pipe(
      tap(() => {
        this.messageService.showInfo(
          'Pago procesado correctamente',
          'top center'
        );
      }),
      catchError(error => {
        this.messageService.showError(
          'Error al procesar pago: ' + error.message,
          'top center'
        );
        throw error;
      })
    );
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): Observable<any> {
    // In a real implementation, you would call the MercadoPago API to get payment status
    // For now, we'll just return a mock response
    return of({
      id: paymentId,
      status: 'approved',
      status_detail: 'accredited',
      transaction_details: {
        transaction_id: 'mock-transaction-id',
        payment_method_reference_id: 'mock-reference-id',
        total_paid_amount: 100,
        installment_amount: 100,
        external_resource_url: 'https://www.mercadopago.com.ar/payments/' + paymentId
      }
    });
  }
} 