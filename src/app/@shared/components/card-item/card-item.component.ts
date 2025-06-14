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
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule, TruncatePipe],
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss'],
})
export class CardItemComponent {
  @Input() product!: IProduct;
  @Output() categorySelected = new EventEmitter<string>();

  constructor(private store: Store<AppState>, private _messageService: MessageService) { }

  isHovered = false;
  isImageZoomed = false;

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  toggleImageZoom() {
    this.isImageZoomed = !this.isImageZoomed;
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
