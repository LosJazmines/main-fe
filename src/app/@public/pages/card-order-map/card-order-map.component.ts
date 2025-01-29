import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-card-order-map',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
  ],
  templateUrl: './card-order-map.component.html',
  styleUrl: './card-order-map.component.scss',
})
export class CardOrderMapComponent {
  center = { lat: -37.320437, lng: -59.139153 };
}
