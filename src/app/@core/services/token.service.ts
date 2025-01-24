import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = '';

  constructor() {}

  // Guarda el token en el almacenamiento local
  setToken(token: string): void {
    localStorage.setItem('user', token);
  }

  // Obtiene el token del almacenamiento local
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('user');
    }
    return null; // o cualquier otro valor por defecto
  }

  // Elimina el token del almacenamiento local
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Verifica si el token existe
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
