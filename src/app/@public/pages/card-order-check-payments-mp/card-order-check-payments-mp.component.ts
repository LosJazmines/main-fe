import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

declare var MercadoPago: any; // Declarar MercadoPago

@Component({
  selector: 'app-card-order-check-payments-mp',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    LucideModule,
    CommonModule,
    GoogleMapsModule,
  ],
  templateUrl: './card-order-check-payments-mp.component.html',
  styleUrls: ['./card-order-check-payments-mp.component.scss'],
})
export class CardOrderCheckPaymentsMpComponent implements OnInit {
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Asegurarse de que solo se ejecute en el navegador
    if (this.isBrowser) {
      this.loadMercadoPagoSDK();
      this.initMercadoPago()
    } else {
      console.error('El entorno no es un navegador.');
    }
  }

  initMercadoPago() {
    // Verificar si el objeto MercadoPago está disponible
    if (typeof MercadoPago !== 'undefined') {
      // Inicializar Mercado Pago con tu clave pública
      const mp = new MercadoPago('TEST-a363850c-18f9-4a25-8552-da8c34016b7d', {
        locale: 'es-AR', // Configura el idioma
      });

      // Configuración del Card Payment Brick
      const settings = {
        initialization: {
          amount: 100, // Monto de la transacción
        },
        customization: {
          visual: {
            style: {
              theme: 'white', // Tema del Brick
            },
          },
        },
        callbacks: {
          onSubmit: (cardFormData: any) => {
            // Manejar el envío de los datos del formulario
            return new Promise((resolve, reject) => {
              fetch('/process_payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardFormData),
              })
                .then((response) => response.json())
                .then((data) => {
                  // Procesar la respuesta del servidor
                  resolve(data);
                })
                .catch((error) => {
                  // Manejar errores
                  reject();
                });
            });
          },
          onReady: () => {
            // Callback cuando el Brick esté listo
          },
          onError: (error: any) => {
            // Manejar errores
          },
        },
      };

      // Crear el Card Payment Brick
      const bricksBuilder = mp.bricks();
      bricksBuilder.create(
        'cardPayment',
        'cardPaymentBrick_container',
        settings
      );
    } else {
      console.error(
        'MercadoPago no está definido. Asegúrate de que el SDK esté cargado correctamente.'
      );
    }
  }

  loadMercadoPagoSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.MercadoPago) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
      }
    });
  }
}
