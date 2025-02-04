import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import RegisterComponent from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Animations } from '../../../../@shared/animations';
import ChangePasswordComponent from '../change-password/change-password.component';
import { AuthService } from '../../../../@apis/auth.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../../@core/services/token.service';
import * as userActions from '../../../../@shared/store/actions/user.actions';
import { MessageService } from '../../../../@core/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [Animations],
})
export default class LoginComponent implements OnInit {
  loginGroup!: FormGroup;
  hide = true;
  formTouched = false;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any,
    private _authService: AuthService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initGroupLogin();
  }

  private initGroupLogin() {
    this.loginGroup = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // register() {
  //   this.dialogRef.close();
  //   this._dialog.open(RegisterComponent, { disableClose: true });
  // }

  openDialogRegister(): void {
    this.dialogRef.close();
    const dialogRef = this._dialog.open<string>(RegisterComponent, {
      width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openDialogChangePasswor(): void {
    this.dialogRef.close();
    const dialogRef = this._dialog.open<string>(ChangePasswordComponent, {
      width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  submitEvent() {
    this.loginUser();
  }

  private loginUser() {
    if (this.loginGroup.valid) {
      const formData = this.loginGroup.value;
      // Llamada al servicio de autenticación para registrar al usuario
      this._authService.login(formData).subscribe({
        next: (response: any) => {
          const { token, ...res } = response;

          // Almacenar el token
          this._tokenService.setToken(response.token);

          // Establecer el usuario actual en el estado
          this.store.dispatch(userActions.setCurrentUser({ currentUser: res }));

          // this._messageService.showError(
          //   'Correo o contraseña incorrectos. Por favor, intenta de nuevo.',
          //   'top right',
          //   5000,
          //   'Aceptar'
          // );
          this.dialogRef.close();

          // Puedes agregar un mensaje de éxito o redirigir al usuario a otra página
        },
        error: (error) => {
          // En caso de error, se maneja aquí
          console.error('Error al Ingresar usuario:', error);
          // Puedes mostrar un mensaje de error si es necesario
        },
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}
