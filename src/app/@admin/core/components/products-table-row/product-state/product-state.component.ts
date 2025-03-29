import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductState } from '@core/enum/product-state.enum';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';
import { Router } from 'lucide-angular';

@Component({
  selector: 'app-product-state',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, RouterModule, FormsModule],
  templateUrl: './product-state.component.html',
  styleUrl: './product-state.component.scss'
})
export class ProductStateComponent {
  // Estado inicial del producto
  selectedState: string = 'local';

  // Método que se dispara al cambiar el estado.
  onStateChange(newState: string) {
    // Popup de confirmación antes de cambiar el estado
    if (confirm(`¿Estás seguro de cambiar el estado a: ${newState}?`)) {
      this.selectedState = newState;
      console.log('Nuevo estado del producto:', newState);
      // Aquí puedes agregar la llamada al backend para actualizar el estado.
    }
  }

}
