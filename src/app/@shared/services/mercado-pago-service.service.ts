import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface MercadoPagoPreference {
  productos: {
    id: string;
    title: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
    picture_url?: string;
  }[];
  email: string;
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: string;
  notification_url?: string;
  statement_descriptor?: string;
  external_reference?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private apiUrl = `${environment.api}/mercado-pago`;
  private mpPublicKey = environment.MERCADOPAGO_PUBLIC_KEY;

  constructor(private _http: HttpClient) { }

  getPreference(data: MercadoPagoPreference): Observable<any> {
    if (!data.back_urls) {
      data.back_urls = {
        success: environment.MP_SUCCESS_URL,
        failure: environment.MP_FAILURE_URL,
        pending: environment.MP_PENDING_URL
      };
    }
    
    if (!data.notification_url) {
      data.notification_url = environment.MP_NOTIFICATION_URL;
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(`${this.apiUrl}/preference`, data, { headers });
  }

  getPaymentStatus(paymentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(`${this.apiUrl}/payment/${paymentId}`, { headers });
  }

  getSellerInfo(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(`${this.apiUrl}/seller-info`, { headers });
  }

  updateSellerCredentials(credentials: { accessToken: string; publicKey: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(`${this.apiUrl}/seller-credentials`, credentials, { headers });
  }

  getPaymentMethods(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(`${this.apiUrl}/payment-methods`, { headers });
  }

  getPublicKey(): string {
    return this.mpPublicKey;
  }
}
