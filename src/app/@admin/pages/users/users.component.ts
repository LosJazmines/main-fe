import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  activeUsers = 120;
  newUsers = 15;
  inactiveUsers = 40;
  totalUsers = 160;

  // Listado de usuarios
  users = [
    { name: 'Juan Pérez', email: 'juan.perez@example.com', status: 'Activo' },
    { name: 'Ana López', email: 'ana.lopez@example.com', status: 'Inactivo' },
    {
      name: 'Carlos Gómez',
      email: 'carlos.gomez@example.com',
      status: 'Activo',
    },
  ];

  filteredUsers = [...this.users];
  statuses = ['Todos', 'Activo', 'Inactivo'];
  selectedStatus = 'Todos';
  searchQuery = '';
  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Users');
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesStatus =
        this.selectedStatus === 'Todos' || user.status === this.selectedStatus;
      const matchesSearch =
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  addUser(): void {
    console.log('Agregar nuevo usuario');
  }

  removeUser(user: any): void {
    this.users = this.users.filter((u) => u !== user);
    this.applyFilters();
    console.log('Usuario eliminado:', user);
  }
}
