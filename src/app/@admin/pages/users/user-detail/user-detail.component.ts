import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsersService, User } from '@apis/users.service';
import { MessageService } from '@core/services/snackbar.service';
import { TypeSnackBarPosition } from '@core/types/snackbar.types';
import { UserFormComponent } from '@shared/components/user-form/user-form.component';

interface UserWithAvatar extends User {
  avatar?: string;
  background?: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    LucideModule,
    MatDialogModule,
    UserFormComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<string>();
  @Output() userUpdated = new EventEmitter<User>();

  isLoading = false;
  error: string | null = null;

  private dialog = inject(MatDialog);
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  onFormSubmit(userData: Partial<User>) {
    if (!this.user?.id) return;

    this.usersService.updateUser(this.user.id, userData).subscribe({
      next: (updatedUser) => {
        this.messageService.showSuccess('Usuario actualizado correctamente', 'top center');
        this.userUpdated.emit(updatedUser);
        this.close.emit();
      },
      error: () => {
        this.messageService.showError('Error al actualizar el usuario', 'top center');
      }
    });
  }

  onFormCancel() {
    this.close.emit();
  }

  deleteContact(contact: UserWithAvatar): void {
    if (!contact) return;

    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.isLoading = true;
      this.error = null;

      this.usersService.deleteUser(contact.id).subscribe({
        next: () => {
          this.messageService.showSuccess('Usuario eliminado correctamente', 'top center');
          this.userDeleted.emit(contact.id);
          this.close.emit();
        },
        error: (err) => {
          this.error = 'Error al eliminar el usuario';
          this.messageService.showError(this.error, 'top center');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  blockContact(contact: UserWithAvatar): void {
    if (!contact) return;

    this.isLoading = true;
    this.error = null;

    this.usersService.toggleUserStatus(contact.id, !contact.isActive).subscribe({
      next: (updatedUser: User) => {
        this.messageService.showSuccess(
          `Usuario ${updatedUser.isActive ? 'activado' : 'bloqueado'} correctamente`,
          'top center'
        );
        this.userUpdated.emit(updatedUser);
      },
      error: (err) => {
        this.error = 'Error al cambiar el estado del usuario';
        this.messageService.showError(this.error, 'top center');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getFullName(): string {
    if (!this.user) return '';
    return this.user.fullName || this.user.username;
  }

  getInitials(): string {
    if (!this.user) return '';
    return this.user.username.charAt(0).toUpperCase();
  }
}