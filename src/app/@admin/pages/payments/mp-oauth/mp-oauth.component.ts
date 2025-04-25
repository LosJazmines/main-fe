import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MercadoPagoService } from '../../../../@core/services/mercado-pago.service';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { MaterialModule } from '../../../../@shared/material/material.module';

@Component({
  selector: 'app-mp-oauth',
  standalone: true,
  imports: [CommonModule, LucideModule, MaterialModule],
  template: `
    <div class="min-h-full flex flex-col items-center justify-center p-4">
      <div class="bg-white shadow rounded-[4px] p-6 w-full max-w-lg text-center">
        <div *ngIf="isLoading" class="mb-4">
          <lucide-icon name="loader" class="w-12 h-12 text-[#3a5a40] animate-spin"></lucide-icon>
          <p class="text-gray-600 mt-2">Procesando autorización de MercadoPago...</p>
        </div>

        <div *ngIf="error" class="mb-4">
          <lucide-icon name="alert-circle" class="w-12 h-12 text-red-500"></lucide-icon>
          <p class="text-red-600 mt-2">{{ error }}</p>
          <button 
            (click)="goBack()"
            class="mt-4 px-4 py-2 bg-[#3a5a40]/80 text-white rounded-[4px] shadow hover:bg-[#3a5a40] focus:outline-none transition"
          >
            Volver a intentar
          </button>
        </div>

        <div *ngIf="success" class="mb-4">
          <lucide-icon name="check-circle" class="w-12 h-12 text-green-500"></lucide-icon>
          <p class="text-green-600 mt-2">Cuenta de MercadoPago integrada correctamente</p>
          <button 
            (click)="goBack()"
            class="mt-4 px-4 py-2 bg-[#3a5a40]/80 text-white rounded-[4px] shadow hover:bg-[#3a5a40] focus:outline-none transition"
          >
            Volver a Pagos
          </button>
        </div>
      </div>
    </div>
  `
})
export default class MpOauthComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _mercadoPagoService = inject(MercadoPagoService);

  isLoading = true;
  error: string | null = null;
  success = false;

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this._route.queryParams.subscribe(params => {
        console.log(params);
        
    //   if (params['code']) {
    //     this.processOAuthCode(params['code'], params['state']);
    //   } else if (params['error']) {
    //     this.error = 'Error al autorizar MercadoPago: ' + params['error_description'];
    //     this.isLoading = false;
    //   }
    });
  }

  private processOAuthCode(code: string, state: string): void {
    this._mercadoPagoService.processOAuthCode(code, state)
      .subscribe({
        next: () => {
          this.success = true;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Error al procesar la autorización: ' + error.message;
          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this._router.navigate(['/a/payments']);
  }
} 