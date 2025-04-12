import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MercadoPagoService, MercadoPagoAccount } from '../../../@core/services/mercado-pago.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export default class PaymentsComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  private _mercadoPagoService = inject(MercadoPagoService);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  
  accounts: MercadoPagoAccount[] = []; // Almacena las cuentas integradas
  paymentForm: FormGroup;
  isIntegrated = false; // Estado de la integración
  submitted = false; // Controla si el formulario ha sido enviado
  isEdit = false; // Indica si estamos editando
  editIndex = -1; // Índice de la cuenta a editar
  isLoading = false; // Estado de carga

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      accessToken: ['', Validators.required],
      publicKey: ['', Validators.required],
      storeName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
    });
  }
  
  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Payments');
    this.loadAccounts();
  }

  /**
   * Load all MercadoPago accounts
   */
  loadAccounts(): void {
    this.isLoading = true;
    this._mercadoPagoService.getAccounts()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(accounts => {
        this.accounts = accounts;
      });
  }

  /**
   * Submit the form to add or update a MercadoPago account
   */
  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.submitted = true;
      this.isLoading = true;
      
      const account: MercadoPagoAccount = this.paymentForm.value;
      
      const operation = this.isEdit
        ? this._mercadoPagoService.updateAccount(account)
        : this._mercadoPagoService.addAccount(account);
      
      operation
        .pipe(finalize(() => {
          this.isLoading = false;
          this.submitted = false;
        }))
        .subscribe({
          next: () => {
            this.loadAccounts();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error saving account:', error);
          }
        });
    } else {
      this.markFormGroupTouched(this.paymentForm);
    }
  }

  /**
   * Edit an existing account
   */
  onEdit(account: MercadoPagoAccount, index: number): void {
    this.isEdit = true;
    this.editIndex = index;
    this.paymentForm.patchValue(account);
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
            this.loadAccounts();
          }
        });
    }
  }

  /**
   * Open dialog to add a new account
   */
  openDialogAddProduct(): void {
    this.resetForm();
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.paymentForm.reset();
    this.isEdit = false;
    this.editIndex = -1;
    this.submitted = false;
  }

  /**
   * Mark all form controls as touched to trigger validation
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
