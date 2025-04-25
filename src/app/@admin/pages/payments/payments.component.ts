import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { MercadoPagoService } from '../../../@core/services/mercado-pago.service';
import { finalize, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IPaymentConfig } from '../../../@core/interfaces/payment-config.interface';
import { Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@shared/store/selectors/user.selector';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export default class PaymentsComponent implements OnInit, OnDestroy {
  private _adminHeaderStore = inject(AdminHeaderStore);
  private _mercadoPagoService = inject(MercadoPagoService);
  private _store = inject(Store);
  
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  
  isLoading = false;
  paymentSettings: IPaymentConfig[] = [];
  formActivePayments: FormControl<number | null> = new FormControl(null);
  private _unsubscribeAll: Subscription = new Subscription();
  MP_URL: string | null = null;
  currentUser: any;

  constructor() {}
  
  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Payments');
    this.loadCurrentUser();
    this.loadPaymentSettings();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.unsubscribe();
  }

  /**
   * Load current user from store
   */
  private loadCurrentUser(): void {
    this._unsubscribeAll.add(
      this._store.select(selectCurrentUser).subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.getMercadoPagoUrl();
        }
      })
    );
  }

  /**
   * Get MercadoPago URL with client ID
   */
  getMercadoPagoUrl(): void {
    const clientId = environment.mp.OUR_MP_CLIENT_ID;
    const state = crypto.randomUUID();
    this.MP_URL = environment.mp.MP_URL
      .replace('OUR_MP_CLIENT_ID', clientId)
      .replace('RANDOM_ID', state)
      .replace('PRODUCER_ID', this.currentUser?.id || '');
  }

  /**
   * Load payment settings
   */
  loadPaymentSettings(): void {
    this._mercadoPagoService.getPaymentSettings()
      .pipe(take(1))
      .subscribe((settings: IPaymentConfig[]) => {
        this.paymentSettings = settings;
        if (this.paymentSettings.length === 1) {
          this.setActivePayment(this.paymentSettings[0]);
        }
        const activePayment = this.paymentSettings.find(p => p.active);
        this.formActivePayments.setValue(activePayment ? activePayment.id : null);
      });
  }

  /**
   * Set active payment configuration
   */
  setActivePayment(payment: IPaymentConfig): void {
    this._mercadoPagoService.setActivePayment(payment.id)
      .pipe(take(1))
      .subscribe(() => {
        this.formActivePayments.setValue(payment.id);
      });
  }

  /**
   * Redirect to MercadoPago OAuth flow
   */
  redirectToMercadoPago(): void {
    if (this.MP_URL) {
      window.location.href = this.MP_URL;
    }
  }

  /**
   * Delete an account
   */
  onDelete(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
      this.isLoading = true;
      this._mercadoPagoService.deleteAccount(id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(success => {
          if (success) {
            this.loadPaymentSettings();
          }
        });
    }
  }
}
