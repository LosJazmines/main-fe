import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import CheckoutComponent from '../checkout/checkout.component';
import { Animations } from '../../../../@shared/animations';
import { AuthService } from '../../../../@apis/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [Animations],
})
export default class RegisterComponent implements OnInit {
  registerGroup!: FormGroup;
  hide = true;
  formTouched = false;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initGroupRegister();
  }

  private initGroupRegister() {
    this.registerGroup = this._fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
    this.dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  submitEvent() {
    const formData = this.registerGroup.value;
    console.log('Valor de todos los campos del evento:');
    console.log({ formData });
    // this.openDialogCheckout();
    this.registerUser()
  }

 private registerUser() {
    if (this.registerGroup.valid) {
      const formData = this.registerGroup.value;

      console.log('Valor de todos los campos del evento:', formData);

      // Llamada al servicio de autenticación para registrar al usuario
      this._authService.register(formData).subscribe({
        next: (response) => {
          // En caso de éxito, se puede agregar más lógica aquí si es necesario
          console.log('Usuario registrado con éxito:', response);
          // Puedes agregar un mensaje de éxito o redirigir al usuario a otra página
        },
        error: (error) => {
          // En caso de error, se maneja aquí
          console.error('Error al registrar usuario:', error);
          // Puedes mostrar un mensaje de error si es necesario
        },
      });
    } else {
      console.log('Formulario no válido');
    }
  }
  openDialogCheckout(): void {
    this.dialogRef.close();
    const dialogRef = this._dialog.open<string>(CheckoutComponent, {
      width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
