import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = '';

  constructor() {}

  // Guarda el token en el almacenamiento local
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtiene el token del almacenamiento local
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
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
