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
import { Animations } from '../../../../@shared/animations';
import CheckoutComponent from '../checkout/checkout.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  animations: [Animations],
})
export default class ChangePasswordComponent implements OnInit {
  changePasswordGroup!: FormGroup;
  hide = true;
  formTouched = false;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initGroupChangePasswor();
  }

  private initGroupChangePasswor() {
    this.changePasswordGroup = this._fb.group({
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
    const formData = this.changePasswordGroup.value;
    console.log('Valor de todos los campos del evento:');
    console.log({ formData });
    this.openDialogCheckout();
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
