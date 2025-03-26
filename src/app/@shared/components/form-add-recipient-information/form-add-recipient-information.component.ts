import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { LucideModule } from '../../lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
@Component({
  selector: 'app-form-add-recipient-information',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './form-add-recipient-information.component.html',
  styleUrl: './form-add-recipient-information.component.scss',
})
export class FormAddRecipientInformationComponent {
  @Output() formCargado = new EventEmitter<any>();

  center = { lat: -37.320437, lng: -59.139153 };
  zoom = 10;
  destinatarioForm: FormGroup;
  codigoPostal: FormControl = new FormControl('', Validators.required);

  metodoEntregaControl: FormControl = new FormControl('', Validators.required);
  metodoEntrega = 'domicilio'; // Default: Envío a domicilio

  codigoPostalValido: boolean = false;
  codigoPostalInvalido: boolean = false;
  codigosPermitidos: string[] = ['7000']; // Solo Tandil

  constructor(private fb: FormBuilder) {
    this.destinatarioForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefonoMovil: ['', []],
      pais: [''],
      estado: [''],
      ciudad: [''],
      comentarios: [''],
      latitud: [''],
      longitud: [''],
    });

    this.formCargado.emit(this.destinatarioForm.value);
  }

  validarCodigoPostal() {
    const codigo = this.codigoPostal.value;
    this.codigoPostalValido = this.codigosPermitidos.includes(codigo);
    this.codigoPostalInvalido = !this.codigoPostalValido;
    if (this.codigoPostalValido) {
      this.center = { lat: -37.320437, lng: -59.139153 };
    }
  }

  seleccionarSucursal(event: any) {
    const sucursal = this.metodoEntrega;
    console.log('Sucursal seleccionada:', sucursal);

    if (sucursal === 'domicilio') {
      this.destinatarioForm.patchValue({
        direccion: 'Avenida España 995, Tandil, Provincia de Buenos Aires',
        latitud: '-37.3207231',
        longitud: '-59.1330871',
      });

      this.center = { lat: -37.3207231, lng: -59.1330871 };
      this.zoom = 16;
      this.formCargado.emit(this.destinatarioForm.value);
    }

    if (sucursal === 'sucursal') {
      this.destinatarioForm.patchValue({
        direccion: '',
        latitud: '',
        longitud: '',
      });

      this.formCargado.emit(this.destinatarioForm.value);

      this.center = { lat: -37.320437, lng: -59.139153 };
      this.zoom = 10;
    }
  }

  // Cuando el usuario selecciona una dirección de Google Places
  handleAddressChange(address: any) {
    const lat = address.geometry.location.lat();
    const lng = address.geometry.location.lng();
    this.center = { lat, lng };
    this.destinatarioForm.patchValue({
      direccion: address.formatted_address,
      ciudad: this.getAddressComponent(address, 'locality'),
      estado: this.getAddressComponent(address, 'administrative_area_level_1'),
      pais: this.getAddressComponent(address, 'country'),
    });
    this.validarCodigoPostalConCoordenadas(lat, lng);
  }

  getAddressComponent(address: Address, type: string): string {
    const component = address.address_components.find((comp) =>
      comp.types.includes(type)
    );
    return component ? component.long_name : '';
  }

  validarCodigoPostalConCoordenadas(lat: number, lng: number) {
    // Coordenadas aproximadas de Tandil, Buenos Aires
    const latMin = -37.35;
    const latMax = -37.25;
    const lngMin = -59.25;
    const lngMax = -59.05;

    if (lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax) {
      this.codigoPostalValido = true;
      this.codigoPostalInvalido = false;
    } else {
      this.codigoPostalValido = false;
      this.codigoPostalInvalido = true;
    }
  }

  // Cuando el usuario escribe manualmente en el input
  async onAddressInput() {
    const direccion = this.destinatarioForm.get('direccion')?.value;
    if (direccion.length > 5) {
      this.geocodeAddress(direccion);
    }
  }

  geocodeAddress(address: string) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();

        // Obtener el código postal de la dirección geocodificada
        const components = results[0].address_components;
        const postalCodeComponent = components.find((component) =>
          component.types.includes('postal_code')
        );
        const postalCode = postalCodeComponent
          ? postalCodeComponent.long_name
          : '';
        console.log({ components, postalCode });

        // Verificar si el código postal es 7000
        if (postalCode === 'B7000') {
          this.center = { lat, lng };
          this.destinatarioForm.patchValue({
            latitud: lat,
            longitud: lng,
          });

          this.zoom = 16;
          console.log('Dirección válida:', this.center);
        }
        //    else {
        //     alert('La dirección ingresada no corresponde al código postal 7000.');
        //   }
      } else {
        // alert('No se pudo geocodificar la dirección.');
      }
    });
  }

  // 📌 Obtener la ubicación actual del usuario
  usarMiUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.center = { lat, lng };
          this.obtenerDireccionDesdeCoords(lat, lng);
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
          alert(
            'No se pudo obtener la ubicación. Asegúrate de permitir el acceso.'
          );
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  }

  obtenerDireccionDesdeCoords(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.destinatarioForm.patchValue({
          direccion: results[0].formatted_address,
          latitud: lat, // 🔥 Asigna la latitud
          longitud: lng, // 🔥 Asigna la longitud
        });
        console.log('Dirección obtenida:', results[0].formatted_address);
      } else {
        console.error('No se pudo obtener la dirección:', status);
      }
    });
  }

  onSubmit() {
    console.log('Formulario enviado:', this.destinatarioForm.value);

    if (this.destinatarioForm.valid) {
      console.log('Formulario enviado:', this.destinatarioForm.value);
      // this.stepCompleted.emit(this.destinatarioForm.value);
    }
  }
}
