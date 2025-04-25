import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

declare const MercadoPago: any;

function loadMercadoPago(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Evitar cargar el script múltiples veces
    if (document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago'));
    document.body.appendChild(script);
  });
}

export interface MercadoPagoPreference {
  productos: {
    product_id: string;
    title: string;
    quantity: number;
    unit_price: number;
    picture_url?: string;
  }[];
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private apiUrl = `${environment.api}/mercado-pago`;
  private mp: any;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  private async initMercadoPago(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Si ya está inicializado, retornar
    if (this.initialized) {
      return;
    }

    try {
      await loadMercadoPago();
      this.mp = new MercadoPago(environment.mp.OUR_MP_CLIENT_ID, {
        locale: 'es-AR',
        advancedFraudPrevention: true
      });

      if (!this.mp) {
        throw new Error('Error al inicializar MercadoPago');
      }

      this.initialized = true;
      console.log('MercadoPago inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar MercadoPago:', error);
      this.initialized = false;
      throw error;
    }
  }

  handlePaymentError(error: HttpErrorResponse | Error) {
    const errorData = {
      timestamp: new Date().toISOString(),
      message: this.getErrorMessage(error),
      paymentId: null,
      status: error instanceof HttpErrorResponse ? error.status : 'unknown',
      details: error instanceof HttpErrorResponse ? error.error : error.message
    };

    // Guardar el error en localStorage
    localStorage.setItem('mpError', JSON.stringify(errorData));

    // Redirigir a la página de error
    this.router.navigate(['/payment-error']);
  }

  private getErrorMessage(error: HttpErrorResponse | Error): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          return 'Los datos del pago son inválidos. Por favor, verifica la información.';
        case 401:
          return 'No estás autorizado para realizar esta operación. Por favor, inicia sesión nuevamente.';
        case 403:
          return 'No tienes permisos para realizar esta operación.';
        case 404:
          return 'El recurso solicitado no fue encontrado.';
        case 500:
          return 'Hubo un error en el servidor. Por favor, intenta más tarde.';
        case 0:
          return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        default:
          return error.error?.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
      }
    }
    return error.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
  }

  getPreference(data: MercadoPagoPreference): Observable<any> {
    return from(this.initMercadoPago()).pipe(
      switchMap(() => {
        // Validaciones
        if (!data.productos || data.productos.length === 0) {
          return throwError(() => new Error('No hay productos en el carrito'));
        }

        if (!data.email) {
          return throwError(() => new Error('El email es requerido'));
        }

        // Validar productos
        const invalidProducts = data.productos.filter(p =>
          !p.unit_price || p.unit_price <= 0 || !p.quantity || p.quantity <= 0
        );

        if (invalidProducts.length > 0) {
          console.error('Productos inválidos:', invalidProducts);
          return throwError(() => new Error('Hay productos con precios o cantidades inválidas'));
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });

        return this.http.post(`${this.apiUrl}/preference`, data, {
          headers,
          observe: 'response'
        }).pipe(
          map(response => response.body),
          catchError(error => {
            console.error('Error completo al crear preferencia:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              headers: error.headers?.keys()
            });

            this.handlePaymentError(error);
            return throwError(() => error);
          })
        );
      })
    );
  }

  getPaymentStatus(paymentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/payment/${paymentId}`, { headers });
  }

  getSellerInfo(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/seller-info`, { headers });
  }

  updateSellerCredentials(credentials: { accessToken: string; publicKey: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.apiUrl}/seller-credentials`, credentials, { headers });
  }

  getPaymentMethods(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.apiUrl}/payment-methods`, { headers });
  }

  getPublicKey(): string {
    return environment.mp.OUR_MP_CLIENT_ID;
  }

  createCardPayment(cardData: any): Observable<any> {
    if (!this.mp) {
      return throwError(() => new Error('MercadoPago no está inicializado'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/process-payment`, cardData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error processing payment:', error);
          return throwError(() => error);
        })
      );
  }
}
