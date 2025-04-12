import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  urlUsers: string = `${environment.api}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _http: HttpClient
  ) {
    // Check if we're in a browser environment before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      // Check if there's a stored user in localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this.urlUsers}/login`, { email, password }).pipe(
      tap(response => {
        if (response.user) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  googleLogin(googleUser: any) {
    console.log('Google login called with:', googleUser);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(`${this.urlUsers}/google`, googleUser, {
      headers: headers,
    });
  }

  register(userData: Partial<User>): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this.urlUsers}/register`, userData).pipe(
      tap(response => {
        if (response.user) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  registerEmail(email: string): Observable<any> {
    console.log('email', email);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.post(
      `${this.urlUsers}/register-email`,
      { email },
      { headers: headers }
    );
  }

  validateToken(token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const ruta = `${this.urlUsers}/validate-token`;
    const body = { token: token };
    return this._http.post(ruta, body, {
      headers: headers,
    });
  }

  // refreshMpToken(payload: any): Observable<any> {
  //   const ruta = `https://api.mercadopago.com/oauth/token`;
  //   const body = payload;
  //   return this._http.post(ruta, body);
  // }

  // getUserInfo() {
  //   let httpOptions = this._httpOptions.getHttpOptions();
  //   const ruta = `${this.urlUsers}/info`;
  //   return this._http.get(ruta, httpOptions);
  // }

  // validTokenRegister(payload: any) {
  //   const ruta = `${this.urlUsers}/activate`;
  //   const body = payload;
  //   return this._http.post(ruta, body);
  // }

  // sendCodeRegister(payload: any) {
  //   const ruta = `${this.urlUsers}/send-code`;
  //   const body = payload;
  //   return this._http.post(ruta, body);
  // }

  // sendRecoverPassword(email: string) {
  //   const ruta = `${this.urlUsers}/send-reset-code`;
  //   const payload = {
  //     email: email,
  //   };
  //   return this._http.post(ruta, payload);
  // }

  // resetPasswordWithToken(payload: { token: string; password: string }) {
  //   const ruta = `${this.urlUsers}/reset-password`;
  //   return this._http.post(ruta, payload);
  // }

  /**
   * Solicitar recuperación de contraseña
   * @param email Email del usuario
   * @returns Observable con la respuesta del servidor
   */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this.urlUsers}/forgot-password`, { email });
  }

  /**
   * Restablecer contraseña
   * @param token Token de restablecimiento
   * @param newPassword Nueva contraseña
   * @returns Observable con la respuesta del servidor
   */
  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(`${this.urlUsers}/reset-password`, { token, password });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this._http.put<User>(`${this.urlUsers}/profile`, userData).pipe(
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(newUser));
          }
          this.currentUserSubject.next(newUser);
        }
      })
    );
  }
}
