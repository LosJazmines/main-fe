import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { SearchModernoReactiveModule } from '../search-moderno-reactive/search-moderno-reactive.module';
import { MatMenuTrigger } from '@angular/material/menu';
import { ProductStateComponent } from './product-state/product-state.component';
import { ProductTypesComponent } from './product-types/product-types.component';

@Component({
  selector: 'app-products-table-row',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    LucideModule,
    SearchModernoReactiveModule,
    ProductStateComponent,
    ProductTypesComponent
  ],
  templateUrl: './products-table-row.component.html',
  styleUrl: './products-table-row.component.scss',
})
export class ProductsTableRowComponent {
  @Input() product!: any;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  verProducto() {
    console.log('Ver Producto');
    // Lógica para ver el producto
  }

  editarProducto() {
    console.log('Editar Producto');
    // Lógica para editar el producto
  }

  eliminarProducto() {
    console.log('Eliminar Producto');
    // Lógica para eliminar el producto
  }
}
