import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  urlUsers: string = `${environment.api}/auth`;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _http: HttpClient
  ) {}

  login(user: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.post(`${this.urlUsers}/login`, user, {
      headers: headers,
    });
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

  register(userData: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const ruta = `${this.urlUsers}/register`;
    const body = userData;
    return this._http.post(ruta, body, {
      headers: headers,
    });
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
}
