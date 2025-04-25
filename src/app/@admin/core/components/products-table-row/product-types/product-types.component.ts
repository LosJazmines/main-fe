import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-product-types',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, RouterModule, FormsModule],
  templateUrl: './product-types.component.html',
  styleUrl: './product-types.component.scss'
})
export class ProductTypesComponent {
  // Tipo de producto por defecto
  selectedType: string = 'fisico';

  // Método para manejar el cambio de tipo de producto
  onTypeChange(newType: string) {
    if (confirm(`¿Estás seguro de cambiar el tipo a: ${newType}?`)) {
      this.selectedType = newType;
      console.log('Nuevo tipo de producto:', newType);
      // Aquí puedes realizar la llamada al backend o cualquier otra acción.
    }
  }
}