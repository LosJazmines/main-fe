import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder } from '@angular/forms';
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

@Component({
  selector: 'app-ordes',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, OrderCardRowComponent],
  templateUrl: './ordes.component.html',
  styleUrl: './ordes.component.scss',
})
export default class OrdesComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  orders: Order[] = [
    {
      id: '1001',
      date: new Date('2025-02-07T10:30:00Z'), // Convertir string a Date
      status: 'Pendiente',
      total: 250.75,
      shipping: {
        isGift: true,
        recipient: {
          name: 'María González',
        },
        method: 'Express',
        estimatedDelivery: new Date('2025-02-10T14:00:00Z'), // Convertir string a Date
      },
      payment: {
        method: 'Tarjeta de Crédito',
        status: 'paid',
      },
      products: [
        {
          id: 'p1',
          name: 'Ramo de Rosas Rojas',
          quantity: 1,
          price: 100.5,
          image: 'https://example.com/rosas.jpg',
        },
        {
          id: 'p2',
          name: 'Caja de Bombones',
          quantity: 1,
          price: 50.25,
          image: 'https://example.com/bombones.jpg',
        },
        {
          id: 'p3',
          name: 'Tarjeta Personalizada',
          quantity: 1,
          price: 25.0,
          image: 'https://example.com/tarjeta.jpg',
        },
      ],
    },
  ];

  // orders = signal([]);

  constructor(
    private _fb: FormBuilder,
    // public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    // @Inject(DIALOG_DATA) public data: any,
    private _ordersService: OrdersService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Pedidos');

    this.getOrdes();
  }

  getOrdes() {
    console.log('hola');
    this._ordersService.getAllOrders().subscribe({
      next: (response: any) => {
        // Process the response here
        // this.orderscal = [...response] ;
        // this.orders.set(response);
        // console.log('orders', this.orders());
        // If you need to handle the response, you can do so here
        // For example:
        // this.products = response.products;
      },
      error: (error) => {
        // In case of error, handle it here
        console.error('Error fetching products:', error);
      },
    });
  }

  // Método para alternar la expansión del panel
  togglePanel(panel: any): void {
    panel.expanded ? panel.close() : panel.open();
  }

  // Métodos para otras acciones
  accionEliminar(pedido: any): void {
    // Lógica para eliminar el pedido
    console.log('Eliminar pedido', pedido);
  }

  accionAprobar(pedido: any): void {
    // Lógica para aprobar el pedido
    console.log('Aprobar pedido', pedido);
  }

  openDialogAddOrder() {
    const dialogRef = this._dialog.open<string>(AddOrderComponent, {
      // width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result: any) => {
      console.log({ result });
      if (result?.success) {
        // this.getProducts();
      }

      this._adminHeaderStore.updateHeaderTitle('Pedidos');
    });
  }
}
