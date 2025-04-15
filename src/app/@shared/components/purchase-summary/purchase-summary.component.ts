import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { LucideModule } from '../../lucide/lucide.module';
import { PipesModule } from '../../../@core/pipes/pipes.module';
import { MaterialModule } from '../../material/material.module';
import { Subscription, Observable, Subject, takeUntil, BehaviorSubject } from 'rxjs';
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
import { HttpClient } from '@angular/common/http';
import { clearCart } from '../../store/actions/user.actions';
import { OrderSuccessDialogComponent } from '../order-success-dialog/order-success-dialog.component';
import * as OrderActions from '../../store/actions/order.actions';
import { selectCanCreateOrder, selectDeliveryInfo, selectDeliveryMethod } from '../../store/selectors/order.selectors';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { DeliveryInfo } from '../../models/order.model';

declare var MercadoPago: any;

interface CartItem {
  id: string;
  quantity: number;
  name?: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
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
    MatProgressSpinnerModule
  ],
  templateUrl: './purchase-summary.component.html',
  styleUrl: './purchase-summary.component.scss',
})
export class PurchaseSummaryComponent implements OnInit, OnDestroy {
  private _unsuscribeAll!: Subscription;
  private isBrowser: boolean;
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
  paymentMethod: 'mercado-pago' | 'web' = 'web';

  // Observables from store
  deliveryInfo$: Observable<DeliveryInfo | null>;
  canCreateOrder$: Observable<boolean>;
  deliveryMethod$: Observable<'PICKUP' | 'DELIVERY'>;

  private destroy$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private store: Store<AppState>,
    private productsService: ProductsService,
    private mercadoPagoService: MercadoPagoService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private orderService: OrderService,
    private cartService: CartService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.deliveryInfo$ = this.store.select(selectDeliveryInfo);
    this.canCreateOrder$ = this.store.select(selectCanCreateOrder);
    this.deliveryMethod$ = this.store.select(selectDeliveryMethod);
  }

  ngOnInit(): void {
    this.getShoppingCart();
    
    // Suscribirse a cambios en el método de entrega
    this.deliveryMethod$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(method => {
      if (method === 'PICKUP') {
        // Para pickup, establecemos la información de la sucursal
        const pickupInfo: DeliveryInfo = {
          direccion: 'Avenida España 995, Tandil, Buenos Aires',
          ciudad: 'Tandil',
          estado: 'Buenos Aires',
          pais: 'Argentina',
          codigoPostal: '7000',
          telefonoMovil: '',
          nombre: '',
          metodoEnvio: 'PICKUP'
        };
        // Validar y actualizar el estado
        this.store.dispatch(OrderActions.validateOrder({ isValid: true }));
      }
    });

    // Escuchar cambios en la información de entrega
    this.deliveryInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(deliveryInfo => {
      if (deliveryInfo) {
        this.store.dispatch(OrderActions.validateOrder({ 
          isValid: this.isDeliveryInfoValid(deliveryInfo) 
        }));
      }
    });
  }

  ngOnDestroy(): void {
    if (this._unsuscribeAll) {
      this._unsuscribeAll.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
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

  // Método para verificar la información de entrega
  private checkDeliveryInfo() {
    if (!this.isBrowser) {
      this.canCreateOrder$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(canCreateOrder => {
        if (!canCreateOrder) {
          this.deliveryInfo$.pipe(
            takeUntil(this.destroy$)
          ).subscribe(deliveryInfo => {
            if (deliveryInfo) {
              this.store.dispatch(OrderActions.setDeliveryMethod({ method: 'DELIVERY' }));
              this.store.dispatch(OrderActions.validateOrder({ isValid: this.isDeliveryInfoValid(deliveryInfo) }));
            } else {
              this.store.dispatch(OrderActions.setDeliveryMethod({ method: 'DELIVERY' }));
              this.store.dispatch(OrderActions.validateOrder({ isValid: false }));
            }
          });
        }
      });
    }
  }

  // Método para validar la información de entrega
  private isDeliveryInfoValid(deliveryInfo: DeliveryInfo | null): boolean {
    if (!deliveryInfo) return false;

    if (deliveryInfo.metodoEnvio === 'PICKUP') {
      // Validar que la dirección sea la de la sucursal
      return !!(
        deliveryInfo.direccion === 'Avenida España 995, Tandil, Buenos Aires' &&
        deliveryInfo.ciudad === 'Tandil' &&
        deliveryInfo.estado === 'Buenos Aires' &&
        deliveryInfo.pais === 'Argentina'
      );
    }

    // Para entrega a domicilio, validar todos los campos requeridos
    return !!(
      deliveryInfo.direccion &&
      deliveryInfo.ciudad === 'Tandil' &&
      deliveryInfo.estado === 'Buenos Aires' &&
      deliveryInfo.pais === 'Argentina' &&
      deliveryInfo.codigoPostal === '7000' &&
      deliveryInfo.nombre &&
      deliveryInfo.telefonoMovil
    );
  }

  private async createMercadoPagoOrder(): Promise<void> {
    throw new Error('Mercado Pago integration not implemented yet');
  }

  private async createWebOrder(): Promise<void> {
    let deliveryInfo: DeliveryInfo | null = null;
    
    this.deliveryInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(info => deliveryInfo = info);

    if (!deliveryInfo) {
      throw new Error('No delivery information available');
    }

    // Validar stock antes de crear la orden
    const cartItems = this.cartService.getCartItems();
    for (const item of cartItems) {
      const product = await this.productsService.getProductById(item.productId).toPromise() as Product;
      if (!product || product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para el producto ${product?.name || item.productId}`);
      }
    }

    const order = await this.orderService.createOrder({
      items: cartItems,
      deliveryInfo,
      paymentMethod: this.paymentMethod
    });

    this.store.dispatch(clearCart());
    this.dialog.open(OrderSuccessDialogComponent, {
      data: order,
      width: '500px',
      disableClose: true
    });
  }

  async pagar(): Promise<void> {
    this.isLoading = true;

    try {
      if (this.paymentMethod === 'mercado-pago') {
        await this.createMercadoPagoOrder();
      } else {
        await this.createWebOrder();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      this.messageService.showError('Error al crear la orden', 'bottom center');
    } finally {
      this.isLoading = false;
    }
  }

  send() {
    console.log('Enviando compra...');
  }
}