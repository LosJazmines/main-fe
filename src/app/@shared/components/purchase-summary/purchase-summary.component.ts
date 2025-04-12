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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

declare var MercadoPago: any;

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
    MatProgressSpinnerModule
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

  isLoading = false;

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
      this.store.select(state => state.currentUser.currentUser).subscribe(user => {
        if (!user) {
          const dialogRef = this.dialog.open(LoginComponent, {
            width: '400px',
            disableClose: true,
            data: { returnUrl: '/checkout' }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.pagar();
            }
          });
          return;
        }

        const cart = this.shoppingCart();
        const total = this.calculateTotal();

        // Validar que haya productos y el total sea mayor a 0
        if (cart.length === 0 || total <= 0) {
          this.messageService.showError('El carrito está vacío o el total es inválido', 'bottom right', 5000);
          return;
        }

        const preferenceData: MercadoPagoPreference = {
          productos: cart.map(item => ({
            product_id: item.id.toString(),
            title: item.name || 'Producto sin nombre',
            quantity: item.quantity,
            unit_price: Math.round(Number(item.price) * 100) / 100, // Asegurar 2 decimales
            picture_url: item.image || undefined
          })).filter(item => item.quantity > 0 && item.unit_price > 0), // Filtrar items inválidos
          email: user.email
        };

        // Validar que haya productos válidos después del filtro
        if (preferenceData.productos.length === 0) {
          this.messageService.showError('No hay productos válidos para procesar', 'bottom right', 5000);
          return;
        }

        console.log('Enviando datos de preferencia:', JSON.stringify(preferenceData, null, 2));
        this.isLoading = true;

        this.mercadoPagoService.getPreference(preferenceData).subscribe({
          next: (response: any) => {
            console.log('Respuesta de MercadoPago:', response);
            this.isLoading = false;

            const mpData = response?.results?.[0];
            
            if (mpData?.link_mercadopago) {
              // Guardar información de la orden
              localStorage.setItem('lastOrder', JSON.stringify({
                items: cart,
                total: total,
                timestamp: new Date().toISOString(),
                preferenceId: mpData.preference_id
              }));

              // Limpiar cualquier error previo
              localStorage.removeItem('mpError');

              // Redirigir al checkout
              console.log('Redirigiendo a:', mpData.link_mercadopago);
              window.location.href = mpData.link_mercadopago;
            } else {
              throw new Error('No se recibió el link de pago');
            }
          },
          error: (error) => {
            console.error('Error detallado:', error);
            this.isLoading = false;
            
            // Guardar el error para debugging
            localStorage.setItem('mpError', JSON.stringify({
              timestamp: new Date().toISOString(),
              error: error.error || error.message || 'Error desconocido'
            }));

            const errorMessage = error.error?.message 
              ? Array.isArray(error.error.message)
                ? error.error.message.join(', ')
                : error.error.message
              : 'Error al procesar el pago. Por favor, intenta nuevamente.';
              
            this.messageService.showError(errorMessage, 'bottom right', 5000);
          }
        });
      });
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      this.isLoading = false;
      this.messageService.showError('Error inesperado al procesar el pago', 'bottom right', 5000);
    }
  }

  private calculateTotal(): number {
    return this.shoppingCart().reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  send() {
    console.log('Enviando compra...');
  }
}