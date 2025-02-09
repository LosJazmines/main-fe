import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  urlUsersApi: string = `${environment.api}/user`;

  constructor(private _http: HttpClient) {}

  getUserByEmail(email: string): Observable<any> {
    // return this.http.get<User | null>(`/api/users/email/${email}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this._http.get(`${this.urlUsersApi}/email/${email}`, {
      headers: headers,
    });
  }

  // Método para registrar solo el correo electrónico
}
