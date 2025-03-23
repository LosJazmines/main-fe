import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideModule } from '../../lucide/lucide.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-shop-filters',
  standalone: true,
  imports: [CommonModule, LucideModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss'],
})
export class ShopFiltersComponent implements OnInit {
  fixedPrices = [
    { value: 'bajo', label: 'Menos de $100' },
    { value: 'medio', label: '$100 - $500' },
    { value: 'alto', label: 'Más de $500' }
  ];

  filters = {
    selectedFixedPrice: null as string | null,
    customPrice: { min: null as number | null, max: null as number | null },
    selectedCategory: null as string | null,
    selectedFlowerType: null as string | null,
  };

  categories: any[] = [
    { id: 'arreglos-premium', label: 'Arreglos Premium' },
    { id: 'ramos-especiales', label: 'Ramos Especiales' },
    { id: 'jazmines-selectos', label: 'Jazmines Selectos' },
    { id: 'decoracion-eventos', label: 'Decoración Eventos' },
  ];

  flowerTypes: any[] = [
    { id: 'jazmines-blancos', label: 'Jazmines Blancos' },
    { id: 'jazmines-amarillos', label: 'Jazmines Amarillos' },
    { id: 'rosas', label: 'Rosas' },
    { id: 'orquideas', label: 'Orquídeas' },
    { id: 'lirios', label: 'Lirios' },
  ];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Opcional: cargar filtros iniciales desde la URL
    this.route.queryParams.subscribe(params => {
      this.filters.selectedCategory = params['category'] || null;
      this.filters.selectedFlowerType = params['flowerType'] || null;
      this.filters.selectedFixedPrice = params['fixedPrice'] || null;
      this.filters.customPrice.min = params['minPrice'] ? +params['minPrice'] : null;
      this.filters.customPrice.max = params['maxPrice'] ? +params['maxPrice'] : null;
    });
  }

  private updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.filters.selectedCategory,
        flowerType: this.filters.selectedFlowerType,
        fixedPrice: this.filters.selectedFixedPrice,
        minPrice: this.filters.customPrice.min,
        maxPrice: this.filters.customPrice.max,
      },
      queryParamsHandling: 'merge',
    });
  }

  selectFixedPrice(value: string) {
    this.filters.selectedFixedPrice = value;
    this.filters.customPrice.min = null;
    this.filters.customPrice.max = null;
    this.updateQueryParams();
  }

  onCustomPriceInput() {
    if (this.filters.customPrice.min !== null || this.filters.customPrice.max !== null) {
      this.filters.selectedFixedPrice = null;
      this.updateQueryParams();
    }
  }

  selectCategory(categoryId: string) {
    this.filters.selectedCategory = categoryId;
    this.updateQueryParams();
  }

  selectFlowerType(flowerTypeId: string) {
    this.filters.selectedFlowerType = flowerTypeId;
    this.updateQueryParams();
  }

  clearFilters() {
    this.filters = {
      selectedFixedPrice: null,
      customPrice: { min: null, max: null },
      selectedCategory: null,
      selectedFlowerType: null,
    };
    this.updateQueryParams();
  }
}
