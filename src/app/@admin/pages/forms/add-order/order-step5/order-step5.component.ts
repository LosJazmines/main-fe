import {
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../@shared/material/material.module';
import { LucideModule } from '../../../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../@shared/store';
import { Subscription } from 'rxjs';
import { selectShoppingCart } from '../../../../../@shared/store/selectors/user.selector';

@Component({
  selector: 'app-order-step5',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-step5.component.html',
  styleUrl: './order-step5.component.scss',
})
export class OrderStep5Component implements OnInit {
  @Output() stepCompleted = new EventEmitter<any>(); // Emitir evento al padre
  @Output() stepBack = new EventEmitter<void>(); // Evento para regresar


  order = input<any>();

  @Input() userData: any;
  @Input() productData: any;
  @Input() shippingData: any;
  @Input() paymentData: any;
  @Output() edit = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>();

  private _unsuscribeAll!: Subscription;
  shoppingCart = signal<any[]>([]);
  constructor(
    // private _messageService: MessageService,
    private store: Store<AppState> // private _productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.getShoppingCart();
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
        }
      });
  }

  onEdit(): void {
    this.edit.emit();
  }

  onSubmit(): void {
    this.confirm.emit('confirm');
  }
}
