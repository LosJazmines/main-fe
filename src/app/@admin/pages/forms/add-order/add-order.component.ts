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
import { OrderStep1Component } from './order-step1/order-step1.component';
import { SearchModernoReactiveModule } from '../../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { OrderStep2Component } from './order-step2/order-step2.component';
import { OrderStep3Component } from './order-step3/order-step3.component';
import { OrderStep4Component } from './order-step4/order-step4.component';
import { OrderStep5Component } from './order-step5/order-step5.component';
import { OrdersService } from '../../../../@apis/orders.service';

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
    OrderStep1Component,
    OrderStep2Component,
    OrderStep3Component,
    OrderStep4Component,
    OrderStep5Component,
    SearchModernoReactiveModule,
  ],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss',
})
export class AddOrderComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  currentStep: number = 0;

  orderData = signal({
    customerId: null,
    nombre_customer: '',
    items: [],
    total: 0,
    status: 'pending',
    nombreDestinatario: '',
    direccion: '',
    ciudad: '',
    estado: '',
    pais: '',
    telefono: '',
    telefonoMovil: '',
    comentarios: '',
    latitud: null,
    longitud: null,
    costoEnvio: '',
    metodoEnvio: '',
    metododepago: '',
  });
  
  isLoading = signal<boolean>(false);

  goToStep(step: number) {
    this.currentStep = step; // Establecer directamente el paso
    console.log({ currentStep: this.currentStep });
  }

  constructor(
    private fb: FormBuilder,
    private orderService: OrdersService,
    public dialogRef: DialogRef<{ success: boolean }>,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Pedidos - Agregar Pedido');
    // this.initGroupLogin();
  }

  onStep1Completed(userData: any) {
    this.orderData.update((prev) => ({
      ...prev,
      customerId: userData.customerId,
      nombre_customer: userData.name,
      telefono: userData.phone,
    }));

    console.log({ orderData: this.orderData() });

    this.goToStep(1);
  }

  onStep2Completed(productsData: any) {
    console.log('productsData:', productsData);

    this.orderData.update((prev) => ({
      ...prev,
      items: productsData.map((product: any) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    }));

    console.log({ orderData2: this.orderData() });
    this.goToStep(2);
  }

  onStep3Completed(destinatarioData: any) {
    console.log({ destinatarioData });

    this.orderData.update((prev) => ({
      ...prev,
      nombreDestinatario: destinatarioData.nombre,
      direccion: destinatarioData.direccion,
      ciudad: destinatarioData.ciudad,
      estado: destinatarioData.estado,
      pais: destinatarioData.pais,
      telefonoMovil: destinatarioData.telefonoMovil,
      comentarios: destinatarioData.comentarios,
      latitud: destinatarioData.latitud,
      longitud: destinatarioData.longitud,
    }));

    console.log({ orderData3: this.orderData() });
    this.goToStep(3);
  }

  onStep4Completed(paymentData: any) {
    console.log('paymentData:', paymentData);

    this.orderData.update((prev) => ({
      ...prev,
      metododepago: paymentData,
    }));

    console.log({ orderData4: this.orderData() });
    this.goToStep(4);
  }

  onStep5Completed(orderData: any) {
    this.orderData.update((prev) => ({
      ...prev,
      total: orderData.total,
    }));

    this.confirmOrder();
  }

  confirmOrder() {
    this.isLoading.set(true);

    const body = {
      customerId: this.orderData().customerId,
      nombre_customer: this.orderData().nombre_customer,
      items: this.orderData().items,
      total: this.orderData().total,
      status: this.orderData().status,
      nombreDestinatario: this.orderData().nombreDestinatario,
      direccion: this.orderData().direccion,
      ciudad: this.orderData().ciudad,
      estado: this.orderData().estado,
      pais: this.orderData().pais,
      telefono: this.orderData().telefono,
      telefonoMovil: this.orderData().telefonoMovil,
      comentarios: this.orderData().comentarios,
      latitud: this.orderData().latitud,
      longitud: this.orderData().longitud,
      costoEnvio: this.orderData().costoEnvio,
      metodoEnvio: this.orderData().metodoEnvio,
    };

    console.log('Orden finalizada:', body);
    // Aquí puedes hacer la petición HTTP para enviar la orden
    this.orderService.createOrder(body).subscribe(
      (response) => {
        console.log('Respuesta de la creación de la orden:', response);
        this._messageService.showInfo(
          'Orden creada exitosamente',
          'bottom right',
          5000
        );
        this.dialogRef.close({ success: true });
        this.isLoading.set(false);
      },
      (error) => {
        console.error('Error al crear producto:', error);
        this._messageService.showError(
          'Error al crear producto',
          'bottom right',
          5000
        );
        this.isLoading.set(false);
      }
    );
  }
  // Función para cerrar el modal
  closeModal() {
    this.dialogRef.close({ success: true });
  }

  goBack() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
