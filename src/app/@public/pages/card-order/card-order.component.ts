import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-order',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './card-order.component.html',
  styleUrl: './card-order.component.scss',
})
export class CardOrderComponent {
  quantity = 1;

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
