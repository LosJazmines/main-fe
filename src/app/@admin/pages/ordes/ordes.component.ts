import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormsModule } from '@angular/forms';
import { OrdersService } from '../../../@apis/orders.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { WebSocketService } from '../../../@core/services/websocket.service';
import { selectCurrentUser } from '@shared/store/selectors/user.selector';
import {
  Order,
  OrderCardRowComponent,
} from '../../core/components/order-card-row/order-card-row.component';
import { AddOrderComponent } from '../forms/add-order/add-order.component';
import { Dialog } from '@angular/cdk/dialog';
import { SearchModernoReactiveModule } from '../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ordes',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    OrderCardRowComponent,
    FormsModule,
    SearchModernoReactiveModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ordes.component.html',
  styleUrls: ['./ordes.component.scss'],
})
export default class OrdesComponent implements OnInit, OnDestroy {
  private _adminHeaderStore = inject(AdminHeaderStore);
  private _webSocketService = inject(WebSocketService);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  
  orders = signal<Order[]>([]);
  allOrders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>('');
  pendingCount = 0;
  sentCount = 0;
  completedCount = 0;
  canceledCount = 0;
  selectedFilter: string = 'pendiente';
  searchTerm: string = '';
  selectedDate: Date | null = null;
  isWebSocketConnected = false;

  private subscriptions: Subscription[] = [];

  // Status mapping from Spanish to English
  private statusMap = {
    'pendiente': 'pending',
    'enviado': 'shipped',
    'completado': 'completed',
    'cancelado': 'cancelled',
    'todos': 'all'
  };

  constructor(
    private _fb: FormBuilder,
    private _dialog: Dialog,
    private _ordersService: OrdersService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Pedidos');
    this.loadInitialOrders();
    this.checkAuthAndInitSocket();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private checkAuthAndInitSocket() {
    // Verificar el estado del usuario en el store
    this.store.select(selectCurrentUser).subscribe(user => {
      console.log('Current user state:', user);
      
      const token = this._tokenService.getToken();
      console.log('Token from service:', token ? 'Present' : 'Not present');

      if (user && token) {
        console.log('User is authenticated, initializing WebSocket');
        this.setupWebSocketConnection();
      } else {
        console.log('User not authenticated or token missing');
        if (!user) console.log('No user in store');
        if (!token) console.log('No token available');
      }
    });
  }

  private setupWebSocketConnection() {
    const token = this._tokenService.getToken();
    if (!token) {
      console.error('No token available for WebSocket connection');
      return;
    }

    console.log('Connecting WebSocket with token');
    this._webSocketService.connect(token);

    const connectionSub = this._webSocketService.getConnectionStatus().subscribe(
      connected => {
        console.log('WebSocket connection status:', connected);
        this.isWebSocketConnected = connected;
        if (connected) {
          this.setupWebSocketListeners();
          this.hasError.set(false);
          this.errorMessage.set('');
          this._messageService.showSuccess(
            'Conexión WebSocket establecida',
            'top right',
            3000
          );
        } else {
          this._messageService.showError(
            'Conexión WebSocket perdida',
            'top right',
            3000
          );
        }
      }
    );

    this.subscriptions.push(connectionSub);
  }

  private setupWebSocketListeners() {
    console.log('Setting up WebSocket listeners');
    const newOrderSub = this._webSocketService.getNewOrders().subscribe(order => {
      console.log('New order received:', order);
      if (order) {
        const currentOrders = this.allOrders();
        this.allOrders.set([order, ...currentOrders]);
        this.calculateCounts(this.allOrders());
        this.loadOrders();
        this._messageService.showSuccess(
          `Nueva orden #${order.orderNumber} recibida`,
          'top right',
          5000
        );
      }
    });

    const orderUpdateSub = this._webSocketService.getOrderUpdates().subscribe(order => {
      console.log('Order update received:', order);
      if (order) {
        const currentOrders = this.allOrders();
        const updatedOrders = currentOrders.map(o => o.id === order.id ? order : o);
        this.allOrders.set(updatedOrders);
        this.calculateCounts(updatedOrders);
        this.loadOrders();
      }
    });

    const orderStatusChangeSub = this._webSocketService.getOrderStatusChanges().subscribe(order => {
      console.log('Order status change received:', order);
      if (order) {
        const currentOrders = this.allOrders();
        const updatedOrders = currentOrders.map(o => o.id === order.id ? order : o);
        this.allOrders.set(updatedOrders);
        this.calculateCounts(updatedOrders);
        this.loadOrders();
      }
    });

    this.subscriptions.push(newOrderSub, orderUpdateSub, orderStatusChangeSub);
  }

  loadInitialOrders() {
    if (this.isLoading()) return;
    
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this._ordersService.getAllOrders().subscribe({
      next: (response: any) => {
        this.allOrders.set(response);
        this.calculateCounts(response);
        this.loadOrders();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching all orders:', error);
        this.isLoading.set(false);
        this.hasError.set(true);
        this.errorMessage.set('Error al cargar las órdenes');
      },
    });
  }

  loadOrders() {
    if (this.selectedFilter === 'todos') {
      this.orders.set(this.allOrders());
    } else {
      const englishStatus = this.statusMap[this.selectedFilter as keyof typeof this.statusMap];
      const filteredOrders = this.allOrders().filter(order => order.status === englishStatus);
      this.orders.set(filteredOrders);
    }
  }

  private calculateCounts(orders: Order[]) {
    this.pendingCount = orders.filter(order => order.status === 'pending').length;
    this.sentCount = orders.filter(order => order.status === 'shipped').length;
    this.completedCount = orders.filter(order => order.status === 'completed').length;
    this.canceledCount = orders.filter(order => order.status === 'cancelled').length;
  }

  onFilterChange(value: string): void {
    this.selectedFilter = value;
    this.loadOrders();
  }

  handleSearch(event: string): void {
    this.searchTerm = event.trim();
    const filters: { searchTerm?: string; creationDate?: string } = {};

    if (this.searchTerm) {
      filters.searchTerm = this.searchTerm;
    }
    if (this.selectedDate) {
      filters.creationDate = this.formatDate(this.selectedDate);
    }

    if (!filters.searchTerm && !filters.creationDate) {
      this.loadOrders();
      return;
    }

    this._ordersService.searchOrders(filters).subscribe({
      next: (orders: any) => {
        this.orders.set(orders);
        this.calculateCounts(orders);
      },
      error: (error: any) => {
        console.error('Error al buscar órdenes:', error);
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateOrder(orderId: string, newStatus: any) {
    this._messageService.closeSnackBar();

    // Convert Spanish status to English for API call
    const englishStatus = this.statusMap[newStatus as keyof typeof this.statusMap] || newStatus;

    this._ordersService.updateOrderStatus(orderId, englishStatus).subscribe({
      next: (updatedOrder: any) => {
        this._messageService.showInfo(
          `Pedido actualizado a "${newStatus}"`,
          'top right',
          5000
        );
      },
      error: (error) => {
        console.error('Error actualizando el pedido:', error);
        this._messageService.showInfo(
          'Error al actualizar el pedido',
          'top right',
          5000,
          'success'
        );
      },
    });
  }

  openDialogAddOrder() {
    const dialogRef = this._dialog.open<string>(AddOrderComponent, {
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result?.success) {
        // No necesitamos recargar las órdenes, el WebSocket lo manejará
      }
      this._adminHeaderStore.updateHeaderTitle('Pedidos');
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.handleSearch(this.searchTerm);
  }

  clearDateFilter(): void {
    this.selectedDate = null;
    (document.querySelector('input[matInput]') as HTMLInputElement).value = '';
    this.handleSearch(this.searchTerm);
  }

  togglePanel(panel: any): void {
    panel.expanded ? panel.close() : panel.open();
  }

  accionEliminar(pedido: any): void {
    console.log('Eliminar pedido', pedido);
  }

  accionAprobar(pedido: any): void {
    console.log('Aprobar pedido', pedido);
  }
}
