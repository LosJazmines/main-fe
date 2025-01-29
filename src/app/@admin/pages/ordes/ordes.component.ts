import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { RouterLink } from '@angular/router';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder } from '@angular/forms';
import { OrdersService } from '../../../@apis/orders.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';

@Component({
  selector: 'app-ordes',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule, LucideModule],
  templateUrl: './ordes.component.html',
  styleUrl: './ordes.component.scss',
})
export default class OrdesComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  pedidos = [
    {
      id: 1001,
      cliente: 'Juan Pérez',
      fecha: '2025-01-15',
      estado: 'Pendiente',
      total: 200,
      detalles: 'Incluye 3 productos: A, B y C.',
    },
    {
      id: 1002,
      cliente: 'María López',
      fecha: '2025-01-16',
      estado: 'Entregada',
      total: 350,
      detalles: 'Incluye 5 productos: X, Y y Z.',
    },
  ];

  orders = signal([]);

  constructor(
    private _fb: FormBuilder,
    // public dialogRef: DialogRef<string>,
    // private _dialog: Dialog,
    // @Inject(DIALOG_DATA) public data: any,
    private _ordersService: OrdersService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Orders');

    this.getOrdes();
  }

  getOrdes() {
    console.log('hola');
    this._ordersService.getAllOrders().subscribe({
      next: (response: any) => {
        // Process the response here
        // this.orderscal = [...response] ;
        this.orders.set(response);
        console.log('orders', this.orders());
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
}
