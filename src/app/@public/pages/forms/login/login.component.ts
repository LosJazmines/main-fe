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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent implements OnInit {
  loginGroup!: FormGroup;
  hide = true;
  formTouched = false;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any
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

  submitEvent() {
    const formData = this.loginGroup.value;
    console.log('Valor de todos los campos del evento:');
    console.log({ formData });
    this.dialogRef.close();
  }
}
