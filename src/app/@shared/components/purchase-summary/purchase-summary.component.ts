import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { LucideModule } from '../../lucide/lucide.module';
import { PipesModule } from '../../../@core/pipes/pipes.module';
import { MaterialModule } from '../../material/material.module';
import { Subscription } from 'rxjs';
import { selectShoppingCart } from '../../store/selectors/user.selector';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { MessageService } from '../../../@core/services/snackbar.service';
import { ProductsService } from '../../../@apis/products.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MercadoPagoService, MercadoPagoPreference } from '../../services/mercado-pago-service.service';
import { MatDialog } from '@angular/material/dialog';
import LoginComponent from '../../../@public/pages/forms/login/login.component';

declare var MercadoPago: any;

function loadMercadoPago(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago'));
    document.body.appendChild(script);
  });
}

@Component({
  selector: 'app-purchase-summary',
  standalone: true,
  imports: [
    CommonModule,
    LucideModule,
    PipesModule,
    MaterialModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './purchase-summary.component.html',
  styleUrl: './purchase-summary.component.scss',
})
export class PurchaseSummaryComponent implements OnInit, OnDestroy {
  private _unsuscribeAll!: Subscription;
  shoppingCart = signal<any[]>([]);
  shoppingCartLength = signal<number | null>(null);
  products = signal<any[]>([]);
  showCartItems = signal<boolean>(false); // Estado del toggle

  isDisabledMp = input<boolean>(true);
  IsButtom = input<boolean>(false);
  @Output() continuarCompra = new EventEmitter<void>();

  // Objeto para manejar la cantidad de cada producto
  quantities: { [key: string]: number } = {};

  showCouponInput = false;
  couponCode = '';
  couponMessage = '';
  discount = signal(0); // Signal to store the discount value


  // List of valid discount coupons
  validCoupons: { [key: string]: number } = {
    DISCOUNT10: 10, // 10% discount
    SAVE5000: 5000, // Fixed discount of $5000
  };

  private unsubscribeAll!: Subscription;


  constructor(
    private messageService: MessageService,
    private store: Store<AppState>,
    private productsService: ProductsService,
    private mercadoPagoService: MercadoPagoService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getShoppingCart();
  }

  ngOnDestroy(): void {
    if (this.unsubscribeAll) {
      this.unsubscribeAll.unsubscribe();
    }
  }

  onContinuarCompra() {
    this.continuarCompra.emit();
  }

  getShoppingCart() {
    this.unsubscribeAll = this.store
      .select(selectShoppingCart)
      .subscribe((shoppingCart: any[] | null) => {
        if (shoppingCart) {
          this.shoppingCart.set(shoppingCart);
          this.shoppingCartLength.set(shoppingCart.length);

          // Mapear cantidades desde el carrito
          this.quantities = shoppingCart.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {} as { [key: string]: number });
        } else {
          this.shoppingCart.set([]);
          this.shoppingCartLength.set(0);
        }
      });
  }

  // Calcular el total del carrito
  totalCarrito = computed(() =>
    this.shoppingCart().reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  totalCantidadProductos = computed(() =>
    this.shoppingCart().reduce((total, product) => total + product.quantity, 0)
  );

  // Computed para calcular el precio total del carrito
  totalPrecioCarrito = computed(() =>
    this.shoppingCart().reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  applyCoupon() {
    if (this.couponCode in this.validCoupons) {
      const value = this.validCoupons[this.couponCode];

      if (value < 100) {
        // Si el cupón es un descuento porcentual
        this.discount.set(
          (this.shoppingCart().reduce(
            (sum, product) => sum + product.price * product.quantity,
            0
          ) *
            value) /
          100
        );
      } else {
        // Si el cupón es un descuento fijo
        this.discount.set(value);
      }

      this.couponMessage = '¡Cupón aplicado con éxito!';
    } else {
      this.couponMessage = 'Código inválido. Intenta nuevamente.';
    }
  }

  async pagar() {
    try {
      // Verificar si el usuario está logueado
      this.store.select(state => state.currentUser.currentUser).subscribe(user => {
        if (!user) {
          // Abrir el popup de login en lugar de redirigir
          const dialogRef = this.dialog.open(LoginComponent, {
            width: '400px',
            disableClose: true,
            data: { returnUrl: '/checkout' }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // Si el login fue exitoso, intentar el pago nuevamente
              this.pagar();
            }
          });
          return;
        }

        // Prepare the preference data in the format expected by the backend
        const preferenceData = {
          productos: this.shoppingCart().map(item => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            currency_id: 'ARS',
            unit_price: item.price,
            picture_url: item.image
          })),
          email: user.email,
          back_urls: {
            success: environment.MP_SUCCESS_URL,
            failure: environment.MP_FAILURE_URL,
            pending: environment.MP_PENDING_URL
          },
          auto_return: 'approved',
          notification_url: environment.MP_NOTIFICATION_URL,
          statement_descriptor: 'LOS JAZMINES',
          external_reference: `ORDER-${Date.now()}`
        };

        // Get the preference from MercadoPago
        this.mercadoPagoService.getPreference(preferenceData).subscribe({
          next: (response: any) => {
            if (response.results && response.results.length > 0) {
              // Redirect to MercadoPago checkout
              window.location.href = response.results[0].link_mercadopago;
            } else {
              this.messageService.showError('Error al procesar el pago', 'bottom right', 5000);
            }
          },
          error: (error) => {
            console.error('Error creating preference:', error);
            this.messageService.showError('Error al procesar el pago', 'bottom right', 5000);
          }
        });
      });
    } catch (error) {
      console.error('Error in payment process:', error);
      this.messageService.showError('Error al procesar el pago', 'bottom right', 5000);
    }
  }

  send() {
    console.log('Enviando compra...');
  }
}