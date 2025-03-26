import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, OnInit, Output, output } from '@angular/core';
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
import LoginComponent from '../login/login.component';
import { LucideModule } from '@shared/lucide/lucide.module';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule, LucideModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  animations: [Animations],
})
export default class CheckoutComponent implements OnInit {
  @Output() setViewType = new EventEmitter<any>();

  checkouGroup!: FormGroup;
  hide = true;
  formTouched = false;


  constructor(
    private _fb: FormBuilder,
    // public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    // @Inject(DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initGroupCheckou();
  }

  private initGroupCheckou() {
    this.checkouGroup = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  emitViewType(view: string) {
    this.setViewType.emit(view);
  }

  closeDialog(): void {
    // this.dialogRef.close();
    // this.dialogRef.closed.subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
  }

  submitEvent() {
    const formData = this.checkouGroup.value;
    console.log('Valor de todos los campos del evento:');
    console.log({ formData });
    this.openDialogLogin();
  }

  openDialogLogin(): void {
    // this.dialogRef.close();
    // const dialogRef = this._dialog.open<string>(LoginComponent, {
    //   width: '250px',
    //   data: { name: 'hola', animal: 'hola' },
    // });

    // dialogRef.closed.subscribe((result) => {
    //   console.log('The dialog was closed');
    // });
  }
}
