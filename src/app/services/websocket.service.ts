import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor(private socket: Socket) {}

  // Listen for new orders
  onNewOrder(): Observable<Order> {
    return this.socket.fromEvent<Order>('newOrder');
  }

  // Listen for order updates
  onOrderUpdate(): Observable<Order> {
    return this.socket.fromEvent<Order>('orderUpdate');
  }

  // Listen for order status changes
  onOrderStatusChange(): Observable<{ orderId: string; status: string }> {
    return this.socket.fromEvent<{ orderId: string; status: string }>('orderStatusChange');
  }

  // Connect to the WebSocket server
  connect() {
    this.socket.connect();
  }

  // Disconnect from the WebSocket server
  disconnect() {
    this.socket.disconnect();
  }
} 