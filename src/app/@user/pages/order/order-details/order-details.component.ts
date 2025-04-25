import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrdersService } from '@core/services/orders.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';
import { Order } from '@core/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule, LucideModule, MaterialModule],
  templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.ordersService.getOrderById(orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading order:', error);
          this.isLoading = false;
        }
      });
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string | undefined): string {
    if (!status) return 'Desconocido';
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }
} 