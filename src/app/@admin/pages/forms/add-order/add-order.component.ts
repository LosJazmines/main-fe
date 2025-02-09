import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from '../../../../@shared/components/loader/loader.component';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ProductsService } from '../../../../@apis/products.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../../@core/services/token.service';
import { MessageService } from '../../../../@core/services/snackbar.service';
import { AdminHeaderStore } from '../../../../@core/store/admin-header.store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderStep1tComponent } from './order-step1/order-step1.component';
import { SearchModernoReactiveModule } from '../../../core/components/search-moderno-reactive/search-moderno-reactive.module';

@Component({
  selector: 'app-add-order',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    OrderStep1tComponent,
    SearchModernoReactiveModule,
  ],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss',
})
export class AddOrderComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  orderForm: FormGroup;

  currentStep: number = 0;
  userFound: boolean = false;

  step1Form!: FormGroup; // Add this line to define step1Form

  goToStep(step: number) {
    this.currentStep = step;
  }

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      total: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required],
      shippingInfo: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Pedidos - Agregar Pedido');
    // this.initGroupLogin();
  }
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.items.push(itemGroup);
    this.updateTotal();
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.updateTotal();
  }

  updateTotal() {
    const total = this.items.controls.reduce((sum, item) => {
      return sum + item.value.quantity * item.value.price; // ✅ Usar `price3`
    }, 0);
    this.orderForm.patchValue({ total });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      console.log('Order submitted', this.orderForm.value);
      // Aquí puedes hacer la petición HTTP para enviar la orden
    } else {
      console.log('Form is invalid');
    }
  }
}
