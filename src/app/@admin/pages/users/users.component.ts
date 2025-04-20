import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService, User, PaginatedResponse } from '../../../@apis/users.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { SearchModernoReactiveModule } from '../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TypeSnackBarPosition } from '@core/types/snackbar.types';

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
    UserDetailComponent,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export default class UsersComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  private _usersService = inject(UsersService);
  private _dialog = inject(MatDialog);
  private _messageService = inject(MessageService);

  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  // User data
  allUsers: User[] = [];  // Store all users
  users: User[] = [];     // Current page users
  filteredUsers: User[] = [];  // Filtered users for current page
  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  loading = false;

  // Filter states
  statuses = ['Todos', 'Activo', 'Inactivo'];
  selectedStatus = 'Todos';
  searchQuery = '';

  // Drawer states
  isDrawerOpen = false;
  selectedUser: User | null = null;
  drawerMode: 'over' | 'side' = 'over';

  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];
  dataSource: MatTableDataSource<User>;
  isLoading = false;
  error: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Users');
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    this._usersService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedResponse<User>) => {
        this.users = response.data;
        this.totalUsers = response.total;
        this.filteredUsers = this.users;
        
        // Update data source
        this.dataSource = new MatTableDataSource<User>(this.filteredUsers);
        
        // Ensure paginator reflects current state
        if (this.paginator) {
          this.paginator.length = this.totalUsers;
          this.paginator.pageSize = this.pageSize;
          this.paginator.pageIndex = this.currentPage - 1;
        }

        // Apply any active filters
        if (this.selectedStatus !== 'Todos' || this.searchQuery) {
          this.applyFilters();
        }
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this._messageService.showError(this.error, 'top center');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
    this.selectedUser = null;
  }

  applyFilters(): void {
    // Filter the current page's users
    this.filteredUsers = this.users.filter((user) => {
      const matchesStatus = this.selectedStatus === 'Todos' || 
        (this.selectedStatus === 'Activo' && user.isActive) ||
        (this.selectedStatus === 'Inactivo' && !user.isActive);
      
      const matchesSearch = this.searchQuery === '' ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (user.fullName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false);
      
      return matchesStatus && matchesSearch;
    });
  }

  openDrawer(user: User): void {
    this.selectedUser = user;
    this.isDrawerOpen = true;
  }

  onBackdropClicked(): void {
    this.isDrawerOpen = false;
  }

  openDialogAddUser(): void {
    const dialogRef = this._dialog.open(UserDetailComponent, {
      width: '500px',
      data: { user: null }
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  removeUser(user: User): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this._usersService.deleteUser(user.id).subscribe({
        next: () => {
          this._messageService.showSuccess('Usuario eliminado correctamente', 'top center');
          this.loadUsers();
        },
        error: () => {
          this._messageService.showError('Error al eliminar el usuario', 'top center');
        }
      });
    }
  }

  handleSearch(event: string): void {
    this.searchQuery = event;
    this.currentPage = 1; // Reset to first page when searching
    this.loadUsers();
  }

  toggleUserStatus(user: User): void {
    this._usersService.toggleUserStatus(user.id, !user.isActive).subscribe({
      next: (updatedUser) => {
        this._messageService.showSuccess(
          `Usuario ${updatedUser.isActive ? 'activado' : 'bloqueado'} correctamente`,
          'top center'
        );
        this.loadUsers();
      },
      error: () => {
        this._messageService.showError('Error al cambiar el estado del usuario', 'top center');
      }
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.currentPage = event.pageIndex + 1;
        this.pageSize = event.pageSize;
        this.loadUsers();
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this._dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this._dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openDetailDialog(user: User): void {
    const dialogRef = this._dialog.open(UserDetailComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadUsers();
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }
}