import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../@apis/products.service';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { Store } from '@ngrx/store';
import { ProductsTableComponent } from '../../core/components/products-table/products-table.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { AddProductComponent } from '../forms/add-product/add-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ProductsTableComponent,
  ],
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

  productsOne = signal<any[]>([]);
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

  constructor(
    private _fb: FormBuilder,
    private _dialog: Dialog,
    private _productsService: ProductsService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Products');
    this.calculateStatistics();
    this.getProducts();
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

  private getProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (response: any) => {
        // Process the response here
        this.products = [...response];
        this.productsOne.set(this.products);
        // If you need to handle the response, you can do so here
        // For example:
        // this.products = response.products;
      },
      error: (error) => {
        // In case of error, handle it here
        console.error('Error fetching products:', error);
      },
    });
  }

  editProduct(product: any): void {
    console.log('Editando producto:', product);
  }

  deleteProduct(product: any): void {
    this.products = this.products.filter((p) => p.id !== product.id);
    this.applyFilters();
    this.calculateStatistics();

    this._productsService.deleteProduct(product?.id).subscribe({
      next: (response: any) => {
        // Process the response here
        this.products = this.products.filter((p) => p.id !== product.id);
        // console.log({ products: this.products });
        this.productsOne.set(this.products);
        // If you need to handle the response, you can do so here
        // For example:
        this._messageService.showInfo(
          'Producto eliminado correctamente',
          'top right',
          5000
        );
      },
      complete: () => {
        console.log('Request completed');
        // This method is called once the request has completed successfully
      },
      error: (error) => {
        // In case of error, handle it here
        console.error('Error fetching products:', error);
      },
    });
  }

  openDialogAddProduct(): void {
    const dialogRef = this._dialog.open<string>(AddProductComponent, {
      // width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
