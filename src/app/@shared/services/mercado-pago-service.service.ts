import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MercadoPagoService {
  private apiUrl = `${environment.api}/mercado-pago`;

  constructor(private _http: HttpClient) { }

  getPreference(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // Se utiliza POST y se envía la data necesaria
    return this._http.post(`${this.apiUrl}/preference`, data, { headers });
  }
}
