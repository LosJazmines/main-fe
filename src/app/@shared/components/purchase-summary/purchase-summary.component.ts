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

import { MercadoPagoService } from '../../services/mercado-pago-service.service';
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
    private mercadoPagoService: MercadoPagoService
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

  // Método para iniciar el proceso de pago
  // pagar() {
  //   const pagoData = {
  //     monto: 100, // Ejemplo
  //     descripcion: 'Producto de ejemplo',
  //     metodo_pago: 'visa', // o el método adecuado
  //     email: 'cliente@ejemplo.com'
  //   };

  //   this.mercadoPagoService.getPreference(pagoData).subscribe((response: any) => {
  //     if (!response || !response.id) {
  //       console.error('Error: No se recibió un ID de preferencia válido.');
  //       return;
  //     }

  //     const mp = new MercadoPago(
  //       'TEST-444977579419473-012917-5e99c6dc33b21b77449e3fc36153787d-284936648',
  //       {
  //         locale: 'es-AR',
  //       }
  //     );

  //     const checkout = mp.checkout({
  //       preference: {
  //         id: response.id,
  //       },
  //       render: {
  //         container: '.cho-container',
  //         label: 'Pagar con Mercado Pago',
  //       },
  //     });

  //     checkout.open();
  //   });
  // }


  async pagar() {
    // Carga el SDK de Mercado Pago
    await loadMercadoPago();

    // Datos de pago
    const pagoData = {
      monto: 100,
      descripcion: 'Producto de ejemplo',
      email: 'cliente@ejemplo.com'
    };
    

    // Inicializa MercadoPago con tu clave pública
    const mp = new window.MercadoPago('APP_USR-ab775a76-3448-4707-9b0d-22083e7c6f6d', { locale: 'es-AR' });

    // Obtiene la preferencia desde el backend
    this.mercadoPagoService.getPreference(pagoData).subscribe((response: any) => {
      if (response.results.length === 0) {

      } else {
        window.location.href = response.results[0].link_mercadopago;
      }

      // Inicializa el checkout
      const checkout = mp.checkout({
        preference: { id: response.id },
        autoOpen: true // Abre el checkout automáticamente
      });
    });
  }


  send() {
    console.log('Enviando compra...');
  }
}