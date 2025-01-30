import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../../@core/services/token.service';
import { MessageService } from '../../../../@core/services/snackbar.service';
import { Store } from '@ngrx/store';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-personal-data-edit',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './personal-data-edit.component.html',
  styleUrls: ['./personal-data-edit.component.scss'],
})
export class PersonalDataEditComponent implements OnInit {
  personalDataForm!: FormGroup;

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
    this.personalDataForm = this._fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.personalDataForm.valid) {
      console.log('Formulario enviado:', this.personalDataForm.value);
    }
  }
}
