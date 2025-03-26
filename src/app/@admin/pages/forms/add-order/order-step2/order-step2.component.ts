import { items } from './../../../../../@apis/data/items';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../../../@shared/material/material.module';
import { LucideModule } from '../../../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardNotDataSourceComponent } from '../../../../../@shared/components/card-not-data-source/card-not-data-source.component';
import { Subscription } from 'rxjs';
import { TokenService } from '../../../../../@core/services/token.service';
import { MessageService } from '../../../../../@core/services/snackbar.service';
import { Dialog } from '@angular/cdk/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../@shared/store';
import { selectShoppingCart } from '../../../../../@shared/store/selectors/user.selector';
import * as userActions from '../../../../../@shared/store/actions/user.actions';
import { SearchModernoReactiveModule } from '../../../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { ProductsService } from '../../../../../@apis/products.service';
import { ProductCardAddComponent } from '../../../../core/components/product-card-add/product-card-add.component';

@Component({
  selector: 'app-order-step2',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    RouterModule,
    SearchModernoReactiveModule,
    CardNotDataSourceComponent,
    ProductCardAddComponent,
  ],
  templateUrl: './order-step2.component.html',
  styleUrl: './order-step2.component.scss',
})
export class OrderStep2Component implements OnInit, OnDestroy {
  @Output() stepCompleted = new EventEmitter<any>(); // Emitir evento al padre
  @Output() stepBack = new EventEmitter<void>(); // Evento para regresar


  private _unsuscribeAll!: Subscription;
  shoppingCart = signal<any[]>([]);
  shoppingCartLength = signal<number | null>(null);
  products = signal<any[]>([]);
  showCartItems = signal<boolean>(false); // Estado del toggle

  // Variables para filtros
  searchTerm: string = '';
  minPrice: number = 0;
  maxPrice: number = 0;
  category: string = '';

  // Objeto para manejar la cantidad de cada producto
  quantities: { [key: string]: number } = {};

  constructor(
    private _messageService: MessageService,
    private store: Store<AppState>,
    private _productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.getShoppingCart();
    this.getProducts();
  }

  ngOnDestroy(): void {
    if (this._unsuscribeAll) {
      this._unsuscribeAll.unsubscribe();
    }
  }

  getShoppingCart() {
    this._unsuscribeAll = this.store
      .select(selectShoppingCart)
      .subscribe((shoppingCart) => {
        if (shoppingCart) {
          this.shoppingCart.set(shoppingCart);
          this.shoppingCartLength.set(shoppingCart.length);

          // Mapear cantidades desde el carrito
          this.quantities = shoppingCart.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {} as { [key: string]: number });
        }
      });
  }

  toggleView(): void {
    this.showCartItems.set(!this.showCartItems());
  }

  removeFromCart(productId: string) {
    this.store.dispatch(userActions.removeFromCart({ productId }));
  }

  increaseQuantity(productId: string) {
    const existingProduct = this.shoppingCart().find(
      (item) => item.id === productId
    );

    if (!existingProduct) {
      const productToAdd = this.products().find(
        (product) => product.id === productId
      );

      if (productToAdd) {
        this.store.dispatch(
          userActions.setShoppingCart({ products: productToAdd })
        );
        return; // Evitar que se dispare increaseQuantity inmediatamente
      }
    }

    this.store.dispatch(userActions.increaseQuantity({ productId }));
  }

  decreaseQuantity(productId: string) {
    if (this.quantities[productId] && this.quantities[productId] > 0) {
      this.quantities[productId]--;
    }

    if (this.quantities[productId] === 0) {
      this.removeFromCart(productId);
    } else {
      this.store.dispatch(userActions.decreaseQuantity({ productId }));
    }
  }

  addToCart(product: any) {
    this.store.dispatch(userActions.setShoppingCart({ products: product }));
  }

  private filterProducts(): void {
    const filters = {
      searchTerm: this.searchTerm || undefined,
      minPrice: this.minPrice > 0 ? this.minPrice : undefined,
      maxPrice: this.maxPrice > 0 ? this.maxPrice : undefined,
      category: this.category.trim() || undefined,
    };

    this._productsService.searchProducts(filters).subscribe({
      next: (products: any) => {
        this.products.set(products);
      },
      error: () => {
        this.products.set([]);
      },
    });
  }

  handleSearch(event?: string): void {
    this.searchTerm = event ? event.trim() : '';

    if (!this.searchTerm) {
      this.getProducts();
    } else {
      this.filterProducts();
    }
  }

  private getProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products.set(response);
      },
      error: () => {
        this.products.set([]);
      },
    });
  }

  onSubmit() {
    if (this.shoppingCartLength() !== 0) {
      this.stepCompleted.emit(this.shoppingCart()); // Enviar datos al padre
    }
  }

  // Método para calcular el total general
  getTotalPrice(): number {
    let total = 0;

    // Recorre el carrito y calcula el precio total
    this.shoppingCart().forEach((item) => {
      const itemTotal = item.price * item.quantity; // Precio por cantidad
      total += itemTotal; // Sumar al total general
    });

    return total; // Devuelve el total general
  }
}
