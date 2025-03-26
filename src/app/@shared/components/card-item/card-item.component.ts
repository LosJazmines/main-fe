import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideModule } from '../../lucide/lucide.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import * as userActions from '../../store/actions/user.actions';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  @Input() name!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() image: string = '/assets/placeholder.svg'; // Imagen por defecto
  @Input() category!: string;
  @Input() isNew: boolean = false;
  @Input() product!: any;
  @Input() isActiveBg: boolean = false;

  @Output() categorySelected = new EventEmitter<string>();

  constructor(private store: Store<AppState>) { }

  addToCart(product: any) {
    console.log({ product: this.product });

    console.log('Agregado al carrito');
    this.store.dispatch(
      userActions.setShoppingCart({ products: [this.product] }) // Asegurar que sea un array
    );
  }
}
