import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-card-order-map',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './card-order-map.component.html',
  styleUrl: './card-order-map.component.scss',
})
export class CardOrderMapComponent {
  center = { lat: -37.320437, lng: -59.139153 };
  zoom = 15;
  destinatarioForm: FormGroup;
  options = {
    types: ['address'],
    componentRestrictions: { country: 'AR' },
  };

  constructor(private fb: FormBuilder, private _router: Router) {
    this.destinatarioForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^\+549\s\d{2}\s\d{8}$/)],
      ],
      telefonoMovil: [
        '',
        [Validators.required, Validators.pattern(/^\+549\s\d{2}\s\d{8}$/)],
      ],
      pais: ['Argentina', Validators.required],
      estado: ['Buenos Aires', Validators.required],
      ciudad: ['', Validators.required],
      comentarios: [''],
    });
  }

  handleAddressChange(address: any) {
    this.center = {
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
    };
    this.destinatarioForm.patchValue({
      direccion: address.formatted_address,
      ciudad: this.getAddressComponent(address, 'locality'),
      estado: this.getAddressComponent(address, 'administrative_area_level_1'),
      pais: this.getAddressComponent(address, 'country'),
    });
  }

  getAddressComponent(address: Address, type: string): string {
    const component = address.address_components.find((comp) =>
      comp.types.includes(type)
    );
    return component ? component.long_name : '';
  }

  onSubmit() {
    if (this.destinatarioForm.valid) {
      console.log('Formulario enviado:', this.destinatarioForm.value);
    }

    this._router.navigate(['/card-order-check-payments']);
  }
}
