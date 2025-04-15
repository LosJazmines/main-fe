import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';
import { OrderStatus } from '../models/order-status.enum';
import { AddressValidationService } from './address-validation.service';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = `${environment.api}/orders`;

  constructor(
    private http: HttpClient,
    private addressValidationService: AddressValidationService
  ) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    if (!orderData.metodoEnvio) {
      return throwError(() => new Error('El método de envío es requerido'));
    }

    const validationResult = this.addressValidationService.validateDeliveryAddress({
      metodoEnvio: orderData.metodoEnvio,
      direccion: orderData.direccion,
      ciudad: orderData.ciudad,
      estado: orderData.estado,
      pais: orderData.pais
    });

    if (!validationResult.isValid) {
      return throwError(() => new Error(validationResult.message));
    }
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  cancelOrder(orderId: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status`, { status: OrderStatus.CANCELLED });
  }
} 