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

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    FormsModule,
    SearchModernoReactiveModule
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

  constructor(
    private _fb: FormBuilder,
    // public dialogRef: DialogRef<string>,
    // private _dialog: Dialog,
    // @Inject(DIALOG_DATA) public data: any,
    // private _usersService: UsersService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) { }

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

  handleSearch(event: string): void {
    // this.searchTerm = event.trim(); // Extrae el término del evento y elimina espacios innecesarios

    // // Arma el objeto de filtros incluyendo solo los valores no vacíos
    // const filters: { searchTerm?: string; creationDate?: string } = {};

    // if (this.searchTerm) {
    //   filters.searchTerm = this.searchTerm;
    // }
    // if (this.selectedDate) {
    //   filters.creationDate = this.formatDate(this.selectedDate);
    // }

    // // Si no hay filtros, carga todas las órdenes
    // if (!filters.searchTerm && !filters.creationDate) {
    //   this.getOrdes();
    //   return;
    // }

    // this._ordersService.searchOrders(filters).subscribe({
    //   next: (orders: any) => {
    //     console.log('Órdenes encontradas:', orders);
    //     this.orders.set(orders);
    //   },
    //   error: (error: any) => {
    //     console.error('Error al buscar órdenes:', error);
    //   },
    // });
  }

  openDialogAddProduct(): void {
    // const dialogRef = this._dialog.open<string>(AddProductComponent, {
    //   // width: '250px',
    //   data: { name: 'hola', animal: 'hola' },
    // });

    // dialogRef.closed.subscribe((result: any) => {
    //   console.log({ result });
    //   if (result?.success) {
    //     this.getProducts();
    //   }

    //   this._adminHeaderStore.updateHeaderTitle('Productos');
    // });
  }
}
