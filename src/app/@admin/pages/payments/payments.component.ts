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

interface Account {
  id: number;
  accessToken: string;
  publicKey: string;
  storeName: string;
  contactEmail: string;
}

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
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();
  accounts: Account[] = []; // Almacena las cuentas integradas

  paymentForm: FormGroup;
  isIntegrated = false; // Estado de la integración
  submitted = false; // Controla si el formulario ha sido enviado
  isEdit = false; // Indica si estamos editando
  editIndex = -1; // Índice de la cuenta a editar

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      accessToken: ['', Validators.required],
      publicKey: ['', Validators.required],
      storeName: [''],
      contactEmail: ['', [Validators.email]],
    });
  }
  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Payments');
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const account: Account = this.paymentForm.value;

      if (this.isEdit) {
        // Actualizar cuenta existente
        this.accounts[this.editIndex] = account;
        this.isEdit = false;
        this.editIndex = -1;
      } else {
        // Agregar nueva cuenta
        account.id = this.accounts.length + 1;
        this.accounts.push(account);
      }

      // Reiniciar formulario
      this.paymentForm.reset();
    }
  }

  onEdit(account: Account, index: number): void {
    this.isEdit = true;
    this.editIndex = index;
    this.paymentForm.patchValue(account);
  }

  onDelete(index: number): void {
    if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
      this.accounts.splice(index, 1);
    }
  }
}
