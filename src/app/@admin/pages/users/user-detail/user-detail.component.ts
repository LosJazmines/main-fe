import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

export interface Contact {
  name: string;
  email: string;
  avatar?: string;
  background?: string;
  tags?: { id: number; title: string }[];
  title?: string;
  company?: string;
  emails?: { email: string; label?: string }[];
  phoneNumbers?: { phoneNumber: string; country?: string; label?: string }[];
  address?: string;
  birthday?: string;
  notes?: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  @Input() contact: any = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatar: '',
    background: '',
    tags: [
      { id: 1, title: 'VIP' },
      { id: 2, title: 'Nuevo' }
    ],
    title: 'Ingeniero de Software',
    company: 'Tech Solutions Inc.',
    emails: [
      { email: 'juan.perez@example.com', label: 'Personal' },
      { email: 'contacto@techsolutions.com', label: 'Trabajo' }
    ],
    phoneNumbers: [
      { phoneNumber: '+1 555-1234', country: 'US', label: 'Móvil' },
      { phoneNumber: '+1 555-5678', country: 'US', label: 'Fijo' }
    ],
    address: '123 Main St, Ciudad, País',
    birthday: '1980-05-15T00:00:00.000Z',
    notes: '<p>Contacto preferido para proyectos de alto impacto. Disponible en horario de oficina.</p>'
  };
  @Output() close: EventEmitter<void> = new EventEmitter();

  editMode = false;

  // Métodos para acciones del contacto
  editContact(contact: Contact): void {
    console.log('Editar contacto:', contact);
    this.editMode = true;
  }

  deleteContact(contact: Contact): void {
    console.log('Eliminar contacto:', contact);
    // Lógica de eliminación
  }

  blockContact(contact: Contact): void {
    console.log('Bloquear contacto:', contact);
    // Lógica de bloqueo
  }

  // Método que se llama al hacer clic en el botón de cierre
  closeDrawer(): void {
    this.close.emit();
  }

}