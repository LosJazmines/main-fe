import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DeliveryInfo, Order, OrderItem } from '../models/order.model';
import { catchError, firstValueFrom } from 'rxjs';
import { throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { selectCurrentUser } from '../store/selectors/user.selector';

interface OrderError {
  code: string;
  message: string;
  details?: string;
}

interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  customerId: string;
  nombre_customer: string;
  nombreDestinatario: string;
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
  metodoEnvio: 'PICKUP' | 'DELIVERY';
  metododepago?: 'web' | 'mercado-pago';
  comentarios?: string;
  telefonoMovil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>
  ) {}

  private handleError(error: HttpErrorResponse) {
    let errorResponse: OrderError = {
      code: 'UNKNOWN_ERROR',
      message: 'Ha ocurrido un error desconocido',
      details: 'Por favor, intente nuevamente más tarde'
    };

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorResponse = {
        code: 'CLIENT_ERROR',
        message: 'Error de conexión',
        details: 'Por favor, verifica tu conexión a internet'
      };
    } else {
      // Error del backend
      if (error.error) {
        errorResponse = {
          code: error.error.code || 'SERVER_ERROR',
          message: error.error.message || 'Error del servidor',
          details: error.error.details || 'Ha ocurrido un error en el servidor'
        };
      }
    }

    return throwError(() => errorResponse);
  }

  async createOrder(request: { 
    items: any[], 
    deliveryInfo: DeliveryInfo, 
    paymentMethod: 'mercado-pago' | 'web' 
  }): Promise<Order> {
    try {
      // Obtener el usuario del store
      const user = await firstValueFrom(this.store.select(selectCurrentUser));
      
      if (!user || !user.id) {
        throw {
          code: 'NO_USER',
          message: 'Usuario no autenticado',
          details: 'Debe iniciar sesión para crear una orden'
        };
      }

      const orderRequest: CreateOrderRequest = {
        items: request.items,
        customerId: user.id,
        nombre_customer: user.nombre || request.deliveryInfo.nombre || 'Cliente',
        nombreDestinatario: request.deliveryInfo.nombre || 'Cliente',
        direccion: request.deliveryInfo.direccion,
        ciudad: request.deliveryInfo.ciudad,
        estado: request.deliveryInfo.estado,
        pais: request.deliveryInfo.pais,
        metodoEnvio: request.deliveryInfo.metodoEnvio || 'PICKUP',
        metododepago: request.paymentMethod,
        comentarios: request.deliveryInfo.comentarios,
        telefonoMovil: request.deliveryInfo.telefonoMovil
      };

      const response = await firstValueFrom(
        this.http.post<Order>(`${environment.api}/orders`, orderRequest)
          .pipe(
            catchError(this.handleError)
          )
      );

      if (!response) {
        throw {
          code: 'NO_RESPONSE',
          message: 'No se recibió respuesta del servidor',
          details: 'Por favor, intente nuevamente'
        };
      }

      // Preparar los datos para el diálogo de éxito
      const dialogData = {
        orderId: response.id,
        items: request.items.map(item => ({
          name: item.name || 'Producto',
          quantity: item.quantity,
          price: item.price * item.quantity // Precio total por item
        })),
        total: request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      return { ...response, dialogData };
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw error as OrderError;
      }
      
      throw {
        code: 'UNEXPECTED_ERROR',
        message: 'Error inesperado',
        details: 'Ha ocurrido un error inesperado al procesar la orden'
      };
    }
  }
} 