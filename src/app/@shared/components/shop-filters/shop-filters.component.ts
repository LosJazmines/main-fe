import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideModule } from '../../lucide/lucide.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-filters',
  standalone: true,
  imports: [CommonModule, LucideModule, FormsModule],
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss'],
})
export class ShopFiltersComponent {
  filters: any = {
    categories: [],
    types: [],
    priceRange: {
      min: '',
      max: '',
    },
  };

  categories: any = [
    { id: 'arreglos-premium', label: 'Arreglos Premium' },
    { id: 'ramos-especiales', label: 'Ramos Especiales' },
    { id: 'jazmines-selectos', label: 'Jazmines Selectos' },
    { id: 'decoracion-eventos', label: 'Decoración Eventos' },
  ];

  flowerTypes: any = [
    { id: 'jazmines-blancos', label: 'Jazmines Blancos' },
    { id: 'jazmines-amarillos', label: 'Jazmines Amarillos' },
    { id: 'rosas', label: 'Rosas' },
    { id: 'orquideas', label: 'Orquídeas' },
    { id: 'lirios', label: 'Lirios' },
  ];

  clearFilters() {
    this.filters = {
      categories: [],
      types: [],
      priceRange: {
        min: '',
        max: '',
      },
    };
  }
}
