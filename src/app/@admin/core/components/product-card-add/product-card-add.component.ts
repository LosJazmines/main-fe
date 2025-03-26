import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { SearchModernoReactiveModule } from '../search-moderno-reactive/search-moderno-reactive.module';

@Component({
  selector: 'app-product-card-add',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    RouterModule,
    SearchModernoReactiveModule,
    // CardNotDataSourceComponent,
  ],
  templateUrl: './product-card-add.component.html',
  styleUrl: './product-card-add.component.scss',
})
export class ProductCardAddComponent implements OnInit {
  product: any = input(); // Para recibir el objeto de producto
  @Input() quantity: number = 1; // Para la cantidad del producto
  @Output() addToCartEvent = new EventEmitter<any>(); // Emitir cuando se agrega al carrito
  @Output() increaseQuantityEvent = new EventEmitter<any>(); // Emitir cuando se incrementa la cantidad
  @Output() decreaseQuantityEvent = new EventEmitter<any>(); // Emitir cuando se decrementa la cantidad
  @Output() removeFromCartEvent = new EventEmitter<any>(); // Emitir cuando se elimina del carrito

  //@Input() showCartAdd: boolean = true;
  @Input() showCartAdd: boolean = true;

  ngOnInit(): void {
    console.log(this.product());
  }
  increaseQuantity() {
    this.increaseQuantityEvent.emit(this.product().id);
  }

  decreaseQuantity() {
    this.decreaseQuantityEvent.emit(this.product().id);
  }

  addToCart() {
    this.addToCartEvent.emit(this.product());
  }

  removeFromCart() {
    this.removeFromCartEvent.emit(this.product().id); // Emitir el evento para eliminar el producto
  }
}
