import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../@core/services/snackbar.service';
import { Dialog } from '@angular/cdk/dialog';
import { AppState } from '../../../@shared/store';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../@core/services/token.service';
import { selectShoppingCart } from '../../../@shared/store/selectors/user.selector';
import { CardNotDataSourceComponent } from '../../../@shared/components/card-not-data-source/card-not-data-source.component';

@Component({
  selector: 'app-card-order',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    RouterModule,
    CardNotDataSourceComponent,
  ],
  templateUrl: './card-order.component.html',
  styleUrl: './card-order.component.scss',
})
export class CardOrderComponent implements OnInit {
  quantity = 1;
  private _unsuscribeAll!: Subscription;
  shoppingCart = signal<any>([]);

  constructor(
    private _tokenService: TokenService,
    private _messageService: MessageService,
    public dialog: Dialog,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
    this.getShoppingCart();
  }

  ngOnDestroy(): void {
    this._unsuscribeAll.unsubscribe();
  }

  getShoppingCart() {
    this._unsuscribeAll = this.store
      .select(selectShoppingCart)
      .subscribe((shoppingCart) => {
        if (shoppingCart) {
          this.shoppingCart.set(shoppingCart);
        }
      });
  }

  removeItem(item: any) {
    this.shoppingCart.set(
      this.shoppingCart().filter((product: any) => product.id !== item.id)
    );
    this._messageService.showInfo('Producto eliminado', 'top right');
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
