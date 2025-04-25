import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { MaterialModule } from '../../../@shared/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { PersonalDataEditComponent } from '../forms/personal-data-edit/personal-data-edit.component';
import { MyAddressesEditComponent } from '../forms/my-addresses-edit/my-addresses-edit.component';
import { Dialog } from '@angular/cdk/dialog';
import { OrdersService } from '@core/services/orders.service';
import { Order } from '@core/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  _router = inject(Router);
  _dialog = inject(Dialog);
  ordersService = inject(OrdersService);
  orders: Order[] = [];

  constructor() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getOrders().subscribe({
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: (error: Error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  toGoToOrderDetail(orderId: string) {
    this._router.navigate(['/orders', orderId]);
  }

  openDialogMyAddressesEdit(): void {
    const dialogRef = this._dialog.open<string>(MyAddressesEditComponent, {
      // width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openDialogPersonalDataEdit(): void {
    const dialogRef = this._dialog.open<string>(PersonalDataEditComponent, {
      // width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
