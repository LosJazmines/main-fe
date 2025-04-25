import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@apis/auth.service';
import { MessageService } from '@core/services/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class ResetPasswordComponent {
  @Output() viewTypeChange = new EventEmitter<string>();

  resetPasswordForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  emitViewType(type: string) {
    this.viewTypeChange.emit(type);
  }

  async submitEvent() {
    if (this.resetPasswordForm.valid) {
      try {
        const token = this.getTokenFromUrl();
        if (!token) {
          this.messageService.showError('Token no válido', 'bottom right', 3000);
          return;
        }

        await this.authService.resetPassword(token, this.resetPasswordForm.value.password);
        this.messageService.showInfo('Contraseña actualizada correctamente', 'bottom right', 3000);
        this.viewTypeChange.emit('login');
      } catch (error) {
        this.messageService.showError('Error al actualizar la contraseña', 'bottom right', 3000);
      }
    }
  }

  private getTokenFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  }
} 