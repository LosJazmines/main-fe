import { Injectable } from '@angular/core';
import { httpOptionsService } from './httpOptions.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  urlUsersApi: string = `${environment.api}/users`;

  constructor(
    private _http: HttpClient,
    private _httpOptions: httpOptionsService
  ) {}
}
