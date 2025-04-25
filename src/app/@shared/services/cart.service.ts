import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { selectShoppingCart } from '../store/selectors/user.selector';
import { OrderItem, CartItem } from '../models/order.model';
import { clearCart } from '../store/actions/user.actions';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private store: Store<AppState>) {}

  getCartItems(): OrderItem[] {
    let items: OrderItem[] = [];
    this.store.select(selectShoppingCart).subscribe(cart => {
      if (cart) {
        items = cart.map((item: CartItem) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }));
      }
    });
    return items;
  }

  clearCart(): void {
    this.store.dispatch(clearCart());
  }
} 