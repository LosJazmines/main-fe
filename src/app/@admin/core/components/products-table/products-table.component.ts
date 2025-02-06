import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchModernoReactiveModule } from '../search-moderno-reactive/search-moderno-reactive.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { ProductsTableRowComponent } from '../products-table-row/products-table-row.component';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    LucideModule,
    SearchModernoReactiveModule,
    ProductsTableRowComponent
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
})
export class ProductsTableComponent {
  @Input() products: any[] = [];
}
