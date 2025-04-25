import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../../@shared/material/material.module';
import { LucideModule } from '../../../../../@shared/lucide/lucide.module';
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
  selector: 'app-order-step3',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-step3.component.html',
  styleUrl: './order-step3.component.scss',
})
export class OrderStep3Component {
  @Output() stepCompleted = new EventEmitter<any>();
  @Output() stepBack = new EventEmitter<void>(); // Evento para regresar


  center = { lat: -37.320437, lng: -59.139153 };
  zoom = 15;
  destinatarioForm: FormGroup;

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
      metodoEnvio: ['DELIVERY'] // Valor por defecto
    });
  }

  // Cuando el usuario selecciona una dirección de Google Places
  handleAddressChange(address: any) {
    console.log('handleAddressChange', address);

    const lat = address.geometry.location.lat();
    const lng = address.geometry.location.lng();

    this.center = { lat, lng };

    this.destinatarioForm.patchValue({
      direccion: address.formatted_address,
      ciudad: this.getAddressComponent(address, 'locality') || '',
      estado:
        this.getAddressComponent(address, 'administrative_area_level_1') || '',
      pais: this.getAddressComponent(address, 'country') || '',
      latitud: lat, // 🔥 Asigna la latitud
      longitud: lng, // 🔥 Asigna la longitud
    });
  }

  getAddressComponent(address: Address, type: string): string {
    const component = address.address_components.find((comp) =>
      comp.types.includes(type)
    );
    return component ? component.long_name : '';
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

        this.center = { lat, lng };

        this.destinatarioForm.patchValue({
          latitud: lat, // 🔥 Asigna la latitud
          longitud: lng, // 🔥 Asigna la longitud
        });

        console.log('Geocoded Address:', this.center);
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
    console.log('Valor del comentario en step3:', this.destinatarioForm.get('comentarios')?.value);
    console.log('Formulario enviado:', this.destinatarioForm.value);

    if (this.destinatarioForm.valid) {
      console.log('Formulario enviado:', this.destinatarioForm.value);
      this.stepCompleted.emit(this.destinatarioForm.value);
    }
  }
}
