import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-card-order-check-payments-mp',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
  ],
  templateUrl: './card-order-check-payments-mp.component.html',
  styleUrl: './card-order-check-payments-mp.component.scss',
})
export class CardOrderCheckPaymentsMpComponent {
  center = { lat: -34.603722, lng: -58.381592 }; // Ubicación (Ej: Buenos Aires)
}
