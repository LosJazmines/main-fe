import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { httpOptionsService } from './httpOptions.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  urlOrders: string = `${environment.api}/orders`;

  constructor(private _http: HttpClient) {}
  // Método para obtener todos los productos
  getAllOrders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(`${this.urlOrders}`, {
      headers: headers,
    });
  }

  // Método para obtener un producto por su ID
  getOrderById(productId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(`${this.urlOrders}/${productId}`, {
      headers: headers,
    });
  }

  // Método para crear un nuevo producto  // Método para crear un nuevo producto
  createOrder(productData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(`${this.urlOrders}`, productData, {
      headers: headers,
    });
  }

  // Método para actualizar un producto existente
  updateOrder(productId: string, productData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.put(`${this.urlOrders}/${productId}`, productData, {
      headers: headers,
    });
  }

  // Método para eliminar un producto por su ID
  deleteOrder(productId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.delete(`${this.urlOrders}/${productId}`, {
      headers: headers,
    });
  }

  // Método para buscar órdenes por nombreDestinatario o dirección
  // searchOrders(searchTerm: string, formattedDate: string) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this._http.get(`${this.urlOrders}/search?searchTerm=${searchTerm}&creationDate=${formattedDate}`, {
  //     headers,
  //   });
  // }

  updateOrderStatus(orderId: string, status: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.patch(
      `${this.urlOrders}/${orderId}/status`,
      { status },
      { headers }
    );
  }

  searchOrders(filters: { searchTerm?: string; creationDate?: string } = {}) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(`${this.urlOrders}/search`, filters, { headers });
  }
}
