import { CommonModule } from '@angular/common';
import { Component, Inject, signal, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Animations } from '@shared/animations';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';
import CheckoutComponent from '../checkout/checkout.component';
import RegisterComponent from '../register/register.component';
import LoginComponent from '../login/login.component';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { MessageService } from '@core/services/snackbar.service';
import { AuthService } from '@apis/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule, LucideModule, CheckoutComponent, RegisterComponent, LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  animations: [Animations],
})
export class AuthComponent {
  view_type = signal('login');
  loading = false;
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  @Output() viewTypeChange = new EventEmitter<string>();

  constructor(
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(AuthService) private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  getTokenFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
  }

  setViewType(type: string) {
    return this.view_type.set(type);
  }

  onSubmitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const email = this.forgotPasswordForm.get('email')?.value;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.messageService.showInfo('Se ha enviado un correo con las instrucciones para recuperar tu contraseña', 'top right');
          this.viewTypeChange.emit('login');
          this.loading = false;
        },
        error: (error) => {
          this.messageService.showError('Error al enviar el correo de recuperación', 'top right');
          this.loading = false;
        }
      });
    }
  }

  onSubmitResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      const { password, confirmPassword } = this.resetPasswordForm.value;
      if (password !== confirmPassword) {
        this.messageService.showError('Las contraseñas no coinciden', 'top right');
        this.loading = false;
        return;
      }
      const token = this.getTokenFromUrl();
      if (!token) {
        this.messageService.showError('Token no válido', 'top right');
        this.loading = false;
        return;
      }
      this.authService.resetPassword(token, password).subscribe({
        next: () => {
          this.messageService.showInfo('Tu contraseña ha sido actualizada correctamente', 'top right');
          this.viewTypeChange.emit('login');
          this.loading = false;
        },
        error: (error) => {
          this.messageService.showError('Error al actualizar la contraseña', 'top right');
          this.loading = false;
        }
      });
    }
  }
}
