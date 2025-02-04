import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../../@core/services/token.service';
import { MessageService } from '../../../../@core/services/snackbar.service';

@Component({
  selector: 'app-my-addresses-edit',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule, ReactiveFormsModule],
  templateUrl: './my-addresses-edit.component.html',
  styleUrls: ['./my-addresses-edit.component.scss'],
})
export class MyAddressesEditComponent implements OnInit {
  addressForm!: FormGroup;


  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,
    @Inject(DIALOG_DATA) public data: any,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}



  ngOnInit(): void {
    this.addressForm = this._fb.group({
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      console.log('Dirección enviada:', this.addressForm.value);
    }
  }
}
