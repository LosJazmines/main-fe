import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Animations } from '../../../../@shared/animations';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  animations: [Animations],
})
export default class CheckoutComponent implements OnInit {
  registerGroup!: FormGroup;
  hide = true;
  formTouched = false;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initGroupRegister();
  }

  private initGroupRegister() {
    this.registerGroup = this._fb.group({
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
