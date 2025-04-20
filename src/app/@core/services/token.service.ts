import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Guarda el token en el almacenamiento local
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // Obtiene el token del almacenamiento local
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null; // o cualquier otro valor por defecto
  }

  // Elimina el token del almacenamiento local
  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // Verifica si el token existe
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
