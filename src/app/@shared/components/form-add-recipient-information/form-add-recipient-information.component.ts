import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { LucideModule } from '../../lucide/lucide.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as OrderActions from '../../store/actions/order.actions';

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
    FormsModule
  ],
  templateUrl: './form-add-recipient-information.component.html',
  styleUrl: './form-add-recipient-information.component.scss',
})
export class FormAddRecipientInformationComponent implements OnInit, AfterViewInit {
  @Output() formCargado = new EventEmitter<any>();
  @Output() validationError = new EventEmitter<string>();
  @ViewChild('searchBox') searchBox!: ElementRef;
  autocomplete: google.maps.places.Autocomplete | undefined;
  isBrowser: boolean;

  center = { lat: -37.320437, lng: -59.139153 }; // Tandil center coordinates
  zoom = 10;
  destinatarioForm: FormGroup;
  codigoPostal: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^7000$')
  ]);

  metodoEntregaControl: FormControl = new FormControl('', Validators.required);
  metodoEntrega: 'domicilio' | 'sucursal' = 'domicilio'; // Default: Envío a domicilio

  codigoPostalValido: boolean = false;
  codigoPostalInvalido: boolean = false;
  direccionValida: boolean = false;

  // Tandil boundaries
  private readonly TANDIL_BOUNDS = {
    north: -37.25,
    south: -37.35,
    east: -59.05,
    west: -59.25
  };

  // Agregar constante para la información de la tienda
  private readonly STORE_INFO = {
    direccion: 'Avenida España 995, Tandil, Buenos Aires',
    latitud: '-37.3207231',
    longitud: '-59.1330871',
    ciudad: 'Tandil',
    estado: 'Buenos Aires',
    pais: 'Argentina',
    codigoPostal: '7000'
  };

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object,
    private store: Store<AppState>
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.destinatarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      telefonoMovil: ['+54 ', [
        Validators.pattern(/^\+54\s?9?\s?\d{2,4}\s?\d{6,8}$/)
      ]],
      pais: ['Argentina'],
      estado: ['Buenos Aires'],
      ciudad: ['Tandil'],
      comentarios: [''],
      latitud: [''],
      longitud: [''],
      codigoPostal: this.codigoPostal
    });

    this.codigoPostal.valueChanges.subscribe(() => {
      if (this.metodoEntrega !== 'sucursal') {
        this.validarCodigoPostal();
      }
    });

    this.destinatarioForm.valueChanges.subscribe(() => {
      const formState = {
        formValid: this.destinatarioForm.valid,
        direccionValida: this.direccionValida,
        codigoPostalValido: this.codigoPostalValido,
        metodoEntrega: this.metodoEntrega,
        formValues: this.destinatarioForm.value,
        formErrors: Object.keys(this.destinatarioForm.controls).reduce((acc: { [key: string]: any }, key) => {
          const control = this.destinatarioForm.get(key);
          acc[key] = control?.errors;
          return acc;
        }, {})
      };
      
      console.log('Form Validation State:', formState);

      const isValid = this.metodoEntrega === 'sucursal' || 
          (this.destinatarioForm.valid && this.direccionValida && this.codigoPostalValido);

      if (isValid) {
        console.log('Emitting form value:', this.destinatarioForm.value);
        this.formCargado.emit(this.destinatarioForm.value);
        
        // Dispatch actions to update store
        if (this.metodoEntrega === 'sucursal') {
          this.store.dispatch(OrderActions.setDeliveryMethod({ method: 'PICKUP' }));
        } else {
          this.store.dispatch(OrderActions.setDeliveryMethod({ method: 'DELIVERY' }));
          this.store.dispatch(OrderActions.setDeliveryInfo({ 
            deliveryInfo: {
              nombre: this.destinatarioForm.value.nombre,
              direccion: this.destinatarioForm.value.direccion,
              ciudad: this.destinatarioForm.value.ciudad,
              estado: this.destinatarioForm.value.estado,
              pais: this.destinatarioForm.value.pais,
              codigoPostal: this.destinatarioForm.value.codigoPostal,
              telefonoMovil: this.destinatarioForm.value.telefonoMovil,
              metodoEnvio: 'DELIVERY',
              comentarios: this.destinatarioForm.value.comentarios
            }
          }));
        }
        this.store.dispatch(OrderActions.validateOrder({ isValid: true }));
      } else {
        console.log('Emitting null - Form invalid');
        this.formCargado.emit(null);
        this.store.dispatch(OrderActions.validateOrder({ isValid: false }));
      }
      this.saveDeliveryInfo();
    });
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Load Google Maps API only in browser
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdEWtAco97sHxnuCO2C932igIAUKsSRoo&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initializeAutocomplete();
      };
      document.head.appendChild(script);
    }

    // Inicializar con delivery por defecto
    this.store.dispatch(OrderActions.setDeliveryMethod({ method: 'DELIVERY' }));
  }

  ngAfterViewInit() {
    if (this.isBrowser && window.google) {
      this.initializeAutocomplete();
    }
  }

  private initializeAutocomplete() {
    if (!this.isBrowser || !this.searchBox?.nativeElement) return;

    this.autocomplete = new google.maps.places.Autocomplete(this.searchBox.nativeElement, {
      types: ['address'],
      componentRestrictions: { country: 'AR' }
    });

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        if (this.isAddressInTandil(lat, lng)) {
          this.center = { lat, lng };
          this.zoom = 16;
          
          // Obtener el código postal
          const postalCode = this.getAddressComponent(place, 'postal_code') || '7000';
          
          this.destinatarioForm.patchValue({
            direccion: place.formatted_address,
            ciudad: this.getAddressComponent(place, 'locality'),
            estado: this.getAddressComponent(place, 'administrative_area_level_1'),
            pais: this.getAddressComponent(place, 'country'),
            latitud: lat.toString(),
            longitud: lng.toString()
          });
          
          // Actualizar el código postal
          this.codigoPostal.setValue(postalCode);
          
          this.direccionValida = true;
          this.destinatarioForm.get('direccion')?.setErrors(null);
          this.validarCodigoPostal();
        } else {
          this.direccionValida = false;
          this.validationError.emit('La dirección debe estar dentro de Tandil');
          this.destinatarioForm.get('direccion')?.setErrors({ 'outsideTandil': true });
        }
      }
    });
  }

  validarCodigoPostal() {
    // Solo validar si no es retiro en sucursal
    if (this.metodoEntrega === 'sucursal') {
      console.log('Código postal: Retiro en sucursal - validación omitida');
      this.codigoPostalValido = true;
      this.codigoPostalInvalido = false;
      return;
    }

    const codigo = this.codigoPostal.value;
    console.log('Validando código postal:', {
      codigo,
      esValido: codigo === '7000'
    });
    
    this.codigoPostalValido = codigo === '7000';
    this.codigoPostalInvalido = !this.codigoPostalValido;
    
    if (!this.codigoPostalValido) {
      console.log('Código postal inválido');
      this.validationError.emit('Solo se permiten envíos al código postal 7000 (Tandil)');
      this.destinatarioForm.get('direccion')?.setErrors({ 'invalidPostalCode': true });
    } else {
      console.log('Código postal válido');
      this.destinatarioForm.get('direccion')?.setErrors(null);
      // Actualizar el código postal en el formulario principal
      this.destinatarioForm.patchValue({ codigoPostal: codigo }, { emitEvent: false });
    }
  }

  seleccionarSucursal(event: any) {
    const method = this.metodoEntrega === 'sucursal' ? 'PICKUP' : 'DELIVERY';
    this.store.dispatch(OrderActions.setDeliveryMethod({ method }));

    if (this.metodoEntrega === 'sucursal') {
      // Pre-fill store address and set all fields as valid
      this.destinatarioForm.patchValue({
        direccion: this.STORE_INFO.direccion,
        latitud: this.STORE_INFO.latitud,
        longitud: this.STORE_INFO.longitud,
        ciudad: this.STORE_INFO.ciudad,
        estado: this.STORE_INFO.estado,
        pais: this.STORE_INFO.pais,
        codigoPostal: this.STORE_INFO.codigoPostal
      });

      this.center = { 
        lat: parseFloat(this.STORE_INFO.latitud), 
        lng: parseFloat(this.STORE_INFO.longitud) 
      };
      this.zoom = 16;
      
      // Set all validation flags to true for store pickup
      this.codigoPostalValido = true;
      this.codigoPostalInvalido = false;
      this.direccionValida = true;
      
      // Mark form controls as valid
      Object.keys(this.destinatarioForm.controls).forEach(key => {
        const control = this.destinatarioForm.get(key);
        if (control) {
          control.setErrors(null);
          control.markAsTouched();
        }
      });
      
      // Save delivery info immediately
      this.saveDeliveryInfo();
    } else {
      // Clear form for delivery option and reset validations
      this.destinatarioForm.reset({
        pais: 'Argentina',
        estado: 'Buenos Aires',
        ciudad: 'Tandil'
      });
      
      // Reset validation flags
      this.codigoPostalValido = false;
      this.codigoPostalInvalido = false;
      this.direccionValida = false;
      
      // Reset map
      this.center = { lat: -37.320437, lng: -59.139153 };
      this.zoom = 10;
      
      // Mark required fields as touched to show validation errors
      ['nombre', 'direccion', 'telefonoMovil'].forEach(field => {
        const control = this.destinatarioForm.get(field);
        if (control) {
          control.setErrors({ required: true });
          control.markAsTouched();
        }
      });
      
      // Remove saved delivery info
      localStorage.removeItem('deliveryInfo');
    }

    // Emit form value (null if delivery and not valid)
    if (this.metodoEntrega === 'sucursal') {
      this.formCargado.emit(this.destinatarioForm.value);
    } else {
      this.formCargado.emit(null);
    }
  }

  handleAddressChange(address: google.maps.places.PlaceResult) {
    const lat = address.geometry?.location?.lat();
    const lng = address.geometry?.location?.lng();
    
    if (!lat || !lng) {
      this.validationError.emit('No se pudo obtener la ubicación');
      return;
    }
    
    // Check if address is within Tandil bounds
    if (this.isAddressInTandil(lat, lng)) {
      this.center = { lat, lng };
      this.destinatarioForm.patchValue({
        direccion: address.formatted_address,
        ciudad: this.getAddressComponent(address, 'locality'),
        estado: this.getAddressComponent(address, 'administrative_area_level_1'),
        pais: this.getAddressComponent(address, 'country'),
        latitud: lat.toString(),
        longitud: lng.toString()
      });
      this.direccionValida = true;
      this.validarCodigoPostal();
    } else {
      this.direccionValida = false;
      this.validationError.emit('La dirección debe estar dentro de Tandil');
      this.destinatarioForm.get('direccion')?.setErrors({ 'outsideTandil': true });
    }
  }

  private isAddressInTandil(lat: number, lng: number): boolean {
    return lat >= this.TANDIL_BOUNDS.south && 
           lat <= this.TANDIL_BOUNDS.north && 
           lng >= this.TANDIL_BOUNDS.west && 
           lng <= this.TANDIL_BOUNDS.east;
  }

  private getAddressComponent(place: google.maps.places.PlaceResult, type: string): string {
    const component = place.address_components?.find(
      (component) => component.types.includes(type)
    );
    return component ? component.long_name : '';
  }

  onAddressInput() {
    this.direccionValida = false;
    if (this.isBrowser && window.google) {
      const geocoder = new google.maps.Geocoder();
      const address = this.destinatarioForm.get('direccion')?.value;
      
      if (address) {
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            if (this.isAddressInTandil(lat, lng)) {
              this.center = { lat, lng };
              this.zoom = 16;
              this.destinatarioForm.patchValue({
                latitud: lat.toString(),
                longitud: lng.toString(),
                ciudad: this.getAddressComponent(results[0], 'locality'),
                estado: this.getAddressComponent(results[0], 'administrative_area_level_1'),
                pais: this.getAddressComponent(results[0], 'country')
              });
              this.direccionValida = true;
              this.destinatarioForm.get('direccion')?.setErrors(null);
            } else {
              this.direccionValida = false;
              this.validationError.emit('La dirección debe estar dentro de Tandil');
              this.destinatarioForm.get('direccion')?.setErrors({ 'outsideTandil': true });
            }
          }
        });
      }
    }
  }

  usarMiUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (this.isAddressInTandil(lat, lng)) {
            this.center = { lat, lng };
            this.zoom = 16;
            this.geocodeLocation(lat, lng);
          } else {
            this.validationError.emit('Tu ubicación está fuera de Tandil');
          }
        },
        (error) => {
          this.validationError.emit('No se pudo obtener tu ubicación');
        }
      );
    }
  }

  private geocodeLocation(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0];
          this.destinatarioForm.patchValue({
            direccion: address.formatted_address,
            ciudad: 'Tandil',
            estado: 'Buenos Aires',
            pais: 'Argentina',
            latitud: lat.toString(),
            longitud: lng.toString()
          });
          this.direccionValida = true;
        }
      }
    );
  }

  onMarkerDrag(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      if (this.isAddressInTandil(lat, lng)) {
        this.center = { lat, lng };
        this.geocodeLocation(lat, lng);
      } else {
        this.validationError.emit('La dirección debe estar dentro de Tandil');
      }
    }
  }

  onFormValid(isValid: boolean) {
    // Form validation is already handled in valueChanges subscription
    // This method is just to satisfy the template binding
  }

  private saveDeliveryInfo() {
    if (this.metodoEntrega === 'sucursal' || 
        (this.destinatarioForm.valid && this.direccionValida && this.codigoPostalValido)) {
      const deliveryInfo = {
        ...this.destinatarioForm.value,
        metodoEnvio: this.metodoEntrega === 'sucursal' ? 'PICKUP' : 'DELIVERY',
        // Si es retiro en sucursal, asegurarnos de que se use la dirección de la tienda
        ...(this.metodoEntrega === 'sucursal' ? {
          direccion: this.STORE_INFO.direccion,
          latitud: this.STORE_INFO.latitud,
          longitud: this.STORE_INFO.longitud,
          ciudad: this.STORE_INFO.ciudad,
          estado: this.STORE_INFO.estado,
          pais: this.STORE_INFO.pais,
          codigoPostal: this.STORE_INFO.codigoPostal
        } : {})
      };
      localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    } else {
      localStorage.removeItem('deliveryInfo');
    }
  }
}
