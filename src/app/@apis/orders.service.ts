import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { httpOptionsService } from './httpOptions.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  urlOrders: string = `${environment.api}/orders`;

  constructor(
    private _http: HttpClient,
    private _httpOptions: httpOptionsService
  ) {}
}
