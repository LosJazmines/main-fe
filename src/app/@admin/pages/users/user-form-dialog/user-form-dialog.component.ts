import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService, User } from '@apis/users.service';
import { MessageService } from '@core/services/snackbar.service';
import { TypeSnackBarPosition } from '@core/types/snackbar.types';

interface UserWithAvatar extends User {
  avatar?: string;
  background?: string;
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="flex flex-col gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">Email es requerido</mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">Email inválido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="firstName">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="lastName">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="phone" placeholder="+XX XXX XXX XXX">
          <mat-error *ngIf="userForm.get('phone')?.hasError('pattern')">Formato de teléfono inválido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="address">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ciudad</mat-label>
          <input matInput formControlName="city">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Código Postal</mat-label>
          <input matInput formControlName="zipCode" placeholder="XXXXX">
          <mat-error *ngIf="userForm.get('zipCode')?.hasError('pattern')">Código postal inválido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="role">
            <mat-option value="USER">Usuario</mat-option>
            <mat-option value="ENCARGADO">Encargado</mat-option>
            <mat-option value="ADMIN">Administrador</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-slide-toggle formControlName="isActive">
          Usuario Activo
        </mat-slide-toggle>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="userForm.invalid || isLoading">
        <span *ngIf="!isLoading">{{ data.mode === 'create' ? 'Crear' : 'Guardar' }}</span>
        <span *ngIf="isLoading">Guardando...</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class UserFormDialogComponent {
  userForm: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);
  private usersService = inject(UsersService);
  private messageService = inject(MessageService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', user?: UserWithAvatar }
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phone: ['', [Validators.pattern(/^\+?[0-9\s-]{10,}$/)]],
      address: [''],
      city: [''],
      zipCode: ['', [Validators.pattern(/^\d{5}$/)]],
      role: ['USER', Validators.required],
      isActive: [true],
      avatar: [''],
      background: ['']
    });

    if (data.mode === 'edit' && data.user) {
      this.userForm.patchValue(data.user);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userData = this.userForm.value;
      
      if (this.data.mode === 'create') {
        this.usersService.createUser(userData).subscribe({
          next: () => {
            this.messageService.showSuccess('Usuario creado correctamente', 'top center');
            this.dialogRef.close(true);
          },
          error: () => {
            this.messageService.showError('Error al crear el usuario', 'top center');
            this.isLoading = false;
          }
        });
      } else if (this.data.mode === 'edit' && this.data.user?.id) {
        this.usersService.updateUser(this.data.user.id, userData).subscribe({
          next: () => {
            this.messageService.showSuccess('Usuario actualizado correctamente', 'top center');
            this.dialogRef.close(true);
          },
          error: () => {
            this.messageService.showError('Error al actualizar el usuario', 'top center');
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 