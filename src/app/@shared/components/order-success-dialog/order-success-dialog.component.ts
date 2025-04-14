import { Component, Inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LucideModule } from '../../lucide/lucide.module';
import { DataSource } from '@angular/cdk/collections';

interface OrderImage {
  id: string;
  url: string;
}

interface OrderProduct {
  id: string;
  name: string;
  images: OrderImage[];
  description: string;
  price: number;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: OrderProduct;
}

interface OrderSuccessData {
  id: string;
  orderNumber: number;
  nombre_customer: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  costoEnvio: string;
  metodoEnvio: string;
  metododepago: string;
  status: string;
  nombreDestinatario: string;
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
}

@Component({
  selector: 'app-order-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    RouterModule,
    LucideModule,
    DecimalPipe
  ],
  templateUrl: './order-success-dialog.component.html',
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .mat-mdc-dialog-container {
      --mdc-dialog-container-color: white;
      padding: 0 !important;
    }
    ::ng-deep .mat-mdc-dialog-surface {
      border-radius: 8px !important;
      overflow: hidden !important;
    }
  `]
})
export class OrderSuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderSuccessData
  ) {
    console.log({ DataSource: this.data });

  }
} 