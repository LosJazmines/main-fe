import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';

export interface Order {
  id: string;
  date: Date;
  status: string;
  total: number;
  shipping: {
    isGift: boolean;
    recipient: {
      name: string;
    };
    method: string;
    estimatedDelivery: Date;
  };
  payment: {
    method: string;
    status: 'paid' | 'pending';
  };
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
}

@Component({
  selector: 'app-order-card-row',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
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
