import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-maintenance-placeholder',
  standalone: true,
  imports: [LucideModule, MaterialModule, CommonModule],
  templateUrl: './maintenance-placeholder.component.html',
  styleUrl: './maintenance-placeholder.component.scss'
})
export class MaintenancePlaceholderComponent {
  @Input() title: string = 'Sección en Mantenimiento';
  @Input() message: string = 'Estamos trabajando para mejorar esta sección. Pronto estará disponible.';
  @Input() estimatedTime: string = 'Próximamente';
  @Input() className: string = '';

}
