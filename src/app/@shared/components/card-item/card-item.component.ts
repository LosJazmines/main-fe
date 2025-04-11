import { MessageService } from './../../../@core/services/snackbar.service';
import { Component, OnChanges, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideModule } from '../../lucide/lucide.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import * as userActions from '../../store/actions/user.actions';
import { IProduct } from '@core/interfaces/product';

// Opcional: define la interface para el producto.


@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss'],
})
export class CardItemComponent {

  // Ahora se recibe un único objeto producto.
  @Input() product!: IProduct;

  // Puedes seguir emitiendo eventos, por ejemplo, para la selección de categoría.
  @Output() categorySelected = new EventEmitter<string>();

  constructor(private store: Store<AppState>, private _messageService: MessageService) { }

  isHovered = false;

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  addToCart() {
    if (this.product) {
      this.store.dispatch(
        userActions.setShoppingCart({ products: [this.product] })
      );
      this._messageService.showInfo('Producto añadido al carrito', 'top center', 3000);
    }
  }
}
