import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormsModule } from '@angular/forms';
import { OrdersService } from '../../../@apis/orders.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import {
  Order,
  OrderCardRowComponent,
} from '../../core/components/order-card-row/order-card-row.component';
import { AddOrderComponent } from '../forms/add-order/add-order.component';
import { Dialog } from '@angular/cdk/dialog';
import { SearchModernoReactiveModule } from '../../core/components/search-moderno-reactive/search-moderno-reactive.module';

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
  ],
  templateUrl: './ordes.component.html',
  styleUrls: ['./ordes.component.scss'],
})
export default class OrdesComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  ordersData: any[] = [];
  pendingCount = 0;
  sentCount = 0;
  completedCount = 0;
  canceledCount = 0;

  selectedOrder: string = 'ascendente'; // Valor por defecto

  orders = signal<Order[]>([]);
  // Variables para búsqueda
  searchTerm: string = '';
  selectedDate: Date | null = null;

  selectedFilter: string = 'pendiente';

  constructor(
    private _fb: FormBuilder,
    private _dialog: Dialog,
    private _ordersService: OrdersService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.ordersData = [
      { id: '1', status: 'pendiente' },
      { id: '2', status: 'enviado' },
      { id: '3', status: 'completado' },
      { id: '4', status: 'cancelado' },
      { id: '5', status: 'pendiente' }
    ];
    this.actualizarContadores();

    this._adminHeaderStore.updateHeaderTitle('Pedidos');
    this.getOrdes();
  }


  actualizarContadores(): void {
    this.pendingCount = this.ordersData.filter(o => o.status === 'pendiente').length;
    this.sentCount = this.ordersData.filter(o => o.status === 'enviado').length;
    this.completedCount = this.ordersData.filter(o => o.status === 'completado').length;
    this.canceledCount = this.ordersData.filter(o => o.status === 'cancelado').length;
  }

  getOrdersByStatus(status: string): Order[] {
    return status === 'todos'
      ? this.ordersData
      : this.ordersData.filter(order => order.status === status);
  }

  onFilterChange(value: string): void {
    this.selectedFilter = value;
  }

  getOrdes() {
    this._ordersService.getAllOrders().subscribe({
      next: (response: any) => {
        this.orders.set(response);
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      },
    });
  }
  // Método para armar los filtros y disparar la búsqueda mediante POST
  handleSearch(event: string): void {
    this.searchTerm = event.trim(); // Extrae el término del evento y elimina espacios innecesarios

    // Arma el objeto de filtros incluyendo solo los valores no vacíos
    const filters: { searchTerm?: string; creationDate?: string } = {};

    if (this.searchTerm) {
      filters.searchTerm = this.searchTerm;
    }
    if (this.selectedDate) {
      filters.creationDate = this.formatDate(this.selectedDate);
    }

    // Si no hay filtros, carga todas las órdenes
    if (!filters.searchTerm && !filters.creationDate) {
      this.getOrdes();
      return;
    }

    this._ordersService.searchOrders(filters).subscribe({
      next: (orders: any) => {
        console.log('Órdenes encontradas:', orders);
        this.orders.set(orders);
      },
      error: (error: any) => {
        console.error('Error al buscar órdenes:', error);
      },
    });
  }

  // Se dispara al seleccionar una fecha en el datepicker
  onDateChange(event: any): void {
    this.selectedDate = event.value; // event.value es un objeto Date
    // Dispara la búsqueda automáticamente al cambiar la fecha
    this.handleSearch(this.searchTerm);
  }

  // Función para formatear la fecha a 'YYYY-MM-DD'
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Otros métodos del componente...

  togglePanel(panel: any): void {
    panel.expanded ? panel.close() : panel.open();
  }

  accionEliminar(pedido: any): void {
    console.log('Eliminar pedido', pedido);
  }

  accionAprobar(pedido: any): void {
    console.log('Aprobar pedido', pedido);
  }

  openDialogAddOrder() {
    const dialogRef = this._dialog.open<string>(AddOrderComponent, {
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result: any) => {
      console.log({ result });
      if (result?.success) {
        this.getOrdes();
      }

      this._adminHeaderStore.updateHeaderTitle('Pedidos');
    });
  }

  clearDateFilter(): void {
    this.selectedDate = null; // Resetea la fecha seleccionada
    (document.querySelector('input[matInput]') as HTMLInputElement).value = ''; // Limpia el input manualmente
    this.handleSearch(this.searchTerm); // Vuelve a ejecutar la búsqueda sin filtro de fecha
  }

  // updateOrder(orderId: string, newStatus: OrderStatus) {
  //   this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
  //     next: () => {
  //       this.orders = this.orders.map((order) =>
  //         order.id === orderId ? { ...order, status: newStatus } : order
  //       );
  //     },
  //     error: (err) => console.error('Error al actualizar estado:', err),
  //   });
  // }
  updateOrder(orderId: string, newStatus: any) {
    this._messageService.closeSnackBar();

    this._ordersService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder: any) => {
        // Busca la orden en la lista y actualiza solo el estado
        const updatedOrders = this.orders().map((o) =>
          o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o
        );

        this.orders.set(updatedOrders);

        this._messageService.showInfo(
          `Pedido actualizado a "${updatedOrder.status}"`,
          'top right',
          5000
        );
      },
      error: (error) => {
        console.error('Error actualizando el pedido:', error);
        this._messageService.showInfo(
          'Error al actualizar el pedido ',
          'top right',
          5000,
          'success'
        );
      },
    });
  }
}
