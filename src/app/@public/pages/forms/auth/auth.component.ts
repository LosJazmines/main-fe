import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Animations } from '@shared/animations';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';
import CheckoutComponent from '../checkout/checkout.component';
import RegisterComponent from '../register/register.component';
import LoginComponent from '../login/login.component';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

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

  constructor(public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any,) { }



  setViewType(type: string) {
    return this.view_type.set(type);
  }
}
