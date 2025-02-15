import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../@shared/material/material.module';
import { LucideModule } from '../../../../../@shared/lucide/lucide.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-order-step4',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-step4.component.html',
  styleUrl: './order-step4.component.scss',
})
export class OrderStep4Component {
  @Output() stepCompleted = new EventEmitter<any>(); // Emitir evento al padre
  @Output() stepBack = new EventEmitter<void>(); // Evento para regresar


  formaPagoForm: FormGroup;
  formasDePago = [
    { id: 'efectivo', nombre: 'Efectivo' },
    { id: 'transferencia', nombre: 'Transferencia' },
    { id: 'web', nombre: 'Web' },
  ];

  constructor(private fb: FormBuilder) {
    this.formaPagoForm = this.fb.group({
      formaDePago: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formaPagoForm.valid) {
      const seleccion = this.formaPagoForm.get('formaDePago')?.value;
      console.log('Forma de Pago seleccionada:', seleccion);
      // Aquí puedes manejar la selección de la forma de pago según tus necesidades

      this.stepCompleted.emit(seleccion); // Enviar datos al padre
    } else {
      console.log('Por favor, seleccione una forma de pago.');
    }
  }
}
