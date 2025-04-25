import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Animations } from '../../../../@shared/animations';
import { LucideModule } from '@shared/lucide/lucide.module';
import { AuthService, User } from '@apis/auth.service';
import { MessageService } from '@core/services/snackbar.service';
import { PaymentService, PaymentItem, PaymentPreference } from '@core/services/payment.service';
import { MercadoPagoService } from '@core/services/mercado-pago.service';
import { finalize } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MaterialModule, 
    ReactiveFormsModule, 
    LucideModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  animations: [Animations],
})
export default class CheckoutComponent implements OnInit {
  @Output() setViewType = new EventEmitter<any>();

  checkoutForm!: FormGroup;
  isLoading = false;
  paymentMethods = [
    { id: 'mercadopago', name: 'MercadoPago', icon: 'credit-card' },
    { id: 'cash', name: 'Efectivo', icon: 'dollar-sign' }
  ];
  selectedPaymentMethod = 'mercadopago';
  cartItems: PaymentItem[] = [];
  totalAmount = 0;

  constructor(
    private _fb: FormBuilder,
    private _dialog: Dialog,
    private authService: AuthService,
    private messageService: MessageService,
    private paymentService: PaymentService,
    private mercadoPagoService: MercadoPagoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initCheckoutForm();
    this.loadCartItems();
  }

  private initCheckoutForm() {
    this.checkoutForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      paymentMethod: ['mercadopago', [Validators.required]]
    });

    // Pre-fill form with user data if available
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.checkoutForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          zipCode: user.zipCode || ''
        });
      }
    });
  }

  private loadCartItems() {
    // In a real implementation, you would load cart items from a service
    // For now, we'll just use mock data
    this.cartItems = [
      {
        id: '1',
        title: 'Producto 1',
        description: 'Descripción del producto 1',
        quantity: 2,
        unit_price: 100,
        currency_id: 'ARS'
      },
      {
        id: '2',
        title: 'Producto 2',
        description: 'Descripción del producto 2',
        quantity: 1,
        unit_price: 150,
        currency_id: 'ARS'
      }
    ];
    
    this.calculateTotal();
  }

  private calculateTotal() {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);
  }

  emitViewType(view: string) {
    this.setViewType.emit(view);
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.checkoutForm.patchValue({ paymentMethod: method });
  }

  submitCheckout() {
    if (this.checkoutForm.valid) {
      this.isLoading = true;
      
      if (this.selectedPaymentMethod === 'mercadopago') {
        this.processMercadoPagoPayment();
      } else {
        this.processCashPayment();
      }
    } else {
      this.messageService.showError(
        'Por favor, completa todos los campos requeridos',
        'top center'
      );
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  private processMercadoPagoPayment() {
    // Get the first MercadoPago account
    this.mercadoPagoService.getAccounts().subscribe({
      next: (accounts) => {
        if (accounts.length === 0) {
          this.messageService.showError(
            'No hay cuentas de MercadoPago configuradas',
            'top center'
          );
          this.isLoading = false;
          return;
        }

        const account = accounts[0];
        
        // Create payment preference with the correct structure
        const preference: PaymentPreference = {
          items: this.cartItems.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            quantity: item.quantity,
            currency_id: item.currency_id || 'ARS',
            unit_price: item.unit_price,
            picture_url: item.picture_url
          })),
          payer: {
            name: this.checkoutForm.get('firstName')?.value,
            surname: this.checkoutForm.get('lastName')?.value,
            email: this.checkoutForm.get('email')?.value,
            phone: {
              area_code: '54', // Código de área para Argentina
              number: this.checkoutForm.get('phone')?.value
            },
            address: {
              street_name: this.checkoutForm.get('address')?.value,
              zip_code: this.checkoutForm.get('zipCode')?.value
            }
          },
          back_urls: {
            success: `${window.location.origin}/payment/success`,
            failure: `${window.location.origin}/payment/failure`,
            pending: `${window.location.origin}/payment/pending`
          },
          auto_return: 'approved',
          notification_url: `${window.location.origin}/api/mercado-pago/notifications`,
          statement_descriptor: 'LOS JAZMINES',
          external_reference: `ORDER-${Date.now()}`
        };

        this.paymentService.createPaymentPreference(preference)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (response) => {
              // Redirect to MercadoPago checkout
              window.location.href = response.init_point;
            },
            error: (error) => {
              console.error('Error creating payment preference:', error);
              this.messageService.showError(
                'Error al procesar el pago. Por favor, intenta nuevamente.',
                'top center'
              );
            }
          });
      },
      error: (error) => {
        console.error('Error getting MercadoPago accounts:', error);
        this.messageService.showError(
          'Error al obtener la configuración de MercadoPago.',
          'top center'
        );
        this.isLoading = false;
      }
    });
  }

  private processCashPayment() {
    // Here you would implement the cash payment logic
    // For now, we'll just show a success message and redirect
    this.messageService.showInfo(
      'Pedido registrado correctamente. Un representante se pondrá en contacto contigo.',
      'top center'
    );
    
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/payment/success']);
    }, 2000);
  }
}
