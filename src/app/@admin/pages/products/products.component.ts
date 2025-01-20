import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export default class ProductsComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  totalProducts = 0;
  totalSold = 0;
  outOfStock = 0;
  lowStock = 0;

  products = [
    {
      id: 101,
      name: 'Rosa Roja',
      category: 'Flores',
      price: 25,
      stock: 15,
      sold: 30,
    },
    {
      id: 102,
      name: 'Cactus Mini',
      category: 'Plantas',
      price: 15,
      stock: 2,
      sold: 20,
    },
    {
      id: 103,
      name: 'Maceta de Cerámica',
      category: 'Macetas',
      price: 50,
      stock: 0,
      sold: 15,
    },
    {
      id: 104,
      name: 'Fertilizante Líquido',
      category: 'Fertilizantes',
      price: 10,
      stock: 7,
      sold: 50,
    },
  ];

  filteredProducts = [...this.products];
  selectedCategory = '';
  minPrice = 0;
  maxPrice = 0;

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Products');
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalProducts = this.products.length;
    this.totalSold = this.products.reduce(
      (sum, product) => sum + product.sold,
      0
    );
    this.outOfStock = this.products.filter(
      (product) => product.stock === 0
    ).length;
    this.lowStock = this.products.filter(
      (product) => product.stock > 0 && product.stock < 5
    ).length;
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory = this.selectedCategory
        ? product.category === this.selectedCategory
        : true;
      const matchesMinPrice = this.minPrice
        ? product.price >= this.minPrice
        : true;
      const matchesMaxPrice = this.maxPrice
        ? product.price <= this.maxPrice
        : true;
      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  editProduct(product: any): void {
    console.log('Editando producto:', product);
  }

  deleteProduct(product: any): void {
    console.log('Eliminando producto:', product);
    this.products = this.products.filter((p) => p.id !== product.id);
    this.applyFilters();
    this.calculateStatistics();
  }
}
