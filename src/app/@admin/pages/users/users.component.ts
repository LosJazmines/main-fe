import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../@apis/users.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { SearchModernoReactiveModule } from '../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { Contact, UserDetailComponent } from './user-detail/user-detail.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    FormsModule,
    SearchModernoReactiveModule,
    UserDetailComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  // Datos de usuarios
  users = [
    { name: 'Juan Pérez', email: 'juan.perez@example.com', status: 'Activo' },
    { name: 'Ana López', email: 'ana.lopez@example.com', status: 'Inactivo' },
    { name: 'Carlos Gómez', email: 'carlos.gomez@example.com', status: 'Activo' },
  ];
  filteredUsers = [...this.users];
  statuses = ['Todos', 'Activo', 'Inactivo'];
  selectedStatus = 'Todos';
  searchQuery = '';

  // Variables para el drawer
  isDrawerOpen = false;
  selectedUser: any = null;
  // Puedes ajustar el modo según tus necesidades: 'over', 'side', etc.
  drawerMode: 'over' | 'side' = 'over';

  constructor(
    private _fb: FormBuilder,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Users');
  }





  closeDrawer(): void {
    this.isDrawerOpen = false;
    console.log('Drawer closed');
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesStatus = this.selectedStatus === 'Todos' || user.status === this.selectedStatus;
      const matchesSearch =
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  openDrawer(user: Contact): void {
    this.selectedUser = user;
    this.isDrawerOpen = true;
    console.log('Drawer opened for:', user);
  }

  onBackdropClicked(): void {
    this.isDrawerOpen = false;
  }

  addUser(): void {
    console.log('Agregar nuevo usuario');
  }

  removeUser(user: any): void {
    this.users = this.users.filter((u) => u !== user);
    this.applyFilters();
    console.log('Usuario eliminado:', user);
  }

  handleSearch(event: string): void {
    this.searchQuery = event;
    this.applyFilters();
  }

  openDialogAddProduct(): void {
    console.log('Abrir diálogo para agregar usuario');
  }
}