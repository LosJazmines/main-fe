import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import { setCurrentUser, clearCurrentUser } from '@shared/store/actions/user.actions';
import { TokenService } from '@core/services/token.service';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  role?: string;
  roles?: string[];
  token?: string;
  nombre?: string;
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
    private _http: HttpClient,
    private store: Store,
    private tokenService: TokenService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      const token = this.tokenService.getToken();
      
      if (storedUser && token) {
        try {
          const user = JSON.parse(storedUser);
          user.token = token;
          this.currentUserSubject.next(user);
          this.store.dispatch(setCurrentUser({ currentUser: user }));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          this.clearStorage();
        }
      } else {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      this.tokenService.removeToken();
    }
    this.currentUserSubject.next(null);
    this.store.dispatch(clearCurrentUser());
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this._http.post<AuthResponse>(`${this.urlUsers}/login`, { email, password }).pipe(
      tap((response) => {
        this.tokenService.setToken(response.token);
        const user = { ...response.user, token: response.token };
        this.currentUserSubject.next(user);
        this.store.dispatch(setCurrentUser({ currentUser: user }));
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
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
          this.tokenService.setToken(response.token);
          const user = { ...response.user, token: response.token };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          this.store.dispatch(setCurrentUser({ currentUser: user }));
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
    this.clearStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.tokenService.isAuthenticated();
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this._http.put<User>(`${this.urlUsers}/profile`, userData).pipe(
      tap(updatedUser => {
        const currentUser = this.currentUserSubject.value;
        const token = this.tokenService.getToken();
        if (currentUser && token) {
          const newUser = { ...currentUser, ...updatedUser, token };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(newUser));
          }
          this.currentUserSubject.next(newUser);
          this.store.dispatch(setCurrentUser({ currentUser: newUser }));
        }
      })
    );
  }
}
