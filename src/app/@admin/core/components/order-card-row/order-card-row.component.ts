import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { OrderStatusPipe } from '../../../../@core/pipes/order-status.pipe';
import { PipesModule } from '../../../../@core/pipes/pipes.module';

export interface Order {
  id: string;
  orderNumber: number;
  total: number;
  subtotal: number;
  status: string;
  nombreDestinatario: string;
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
  telefono: string;
  telefonoMovil: string;
  comentarios: string;
  latitud: number;
  longitud: number;
  costoEnvio: string; // Nuevo campo agregado
  metodoEnvio: string; // Nuevo campo agregado
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      images: string[];
      category: string;
      characteristics: string | null;
    };
  }[];
  customer: {
    id: string;
    username?: string ;
    direccion?: string;
    telefono?: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    roles: string[];
  };
}

@Component({
  selector: 'app-order-card-row',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, PipesModule],
  templateUrl: './order-card-row.component.html',
  styleUrl: './order-card-row.component.scss',
})
export class OrderCardRowComponent {
  @Input() order!: Order;
  @Output() process = new EventEmitter<void>();
  @Output() postpone = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isOpen = false;

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  @Output() updateStatus = new EventEmitter<void>();

  changeStatus(newStatus: any) {
    this.updateStatus.emit(newStatus);
  }

  printReceipt(order: any) {
    const printContent = `
      <html>
        <head>
          <style>
            @media print {
              body {
                font-family: 'Courier New', Courier, monospace;
                font-size: 12px;
                text-align: center;
                margin: 0;
                padding: 5px;
                width: 58mm; /* Ajusta según el ancho del rollo */
              }
              .ticket {
                width: 100%;
                max-width: 58mm; /* Ajuste para impresoras térmicas */
              }
              .title {
                font-size: 14px;
                font-weight: bold;
              }
              .info {
                font-size: 12px;
                margin: 2px 0;
              }
              .separator {
                border-top: 1px dashed black;
                margin: 5px 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="title">Pedido #${order.id}</div>
            <div class="info"><strong>Cliente:</strong> ${
              order.clientName
            }</div>
            <div class="info"><strong>Teléfono:</strong> ${
              order.clientPhone
            }</div>
            <div class="info"><strong>Dirección:</strong> ${
              order.clientAddress
            }</div>
            <div class="info"><strong>Fecha:</strong> ${new Date(
              order.date
            ).toLocaleString()}</div>
            <div class="separator"></div>
            <div class="info">¡Gracias por su compra!</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
