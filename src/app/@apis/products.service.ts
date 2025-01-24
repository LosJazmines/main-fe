import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { httpOptionsService } from './httpOptions.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  urlProducts: string = `${environment.api}/product`;

  constructor(
    private _http: HttpClient,
    private _httpOptions: httpOptionsService
  ) {}
  // Método para obtener todos los productos
  getAllProducts() {
    let httpOptions = this._httpOptions.getHttpOptions();

    return this._http.get(`${this.urlProducts}`, httpOptions);
  }

  // Método para obtener un producto por su ID
  getProductById(productId: string) {
    let httpOptions = this._httpOptions.getHttpOptions();

    return this._http.get(`${this.urlProducts}/${productId}`, httpOptions);
  }

  // Método para crear un nuevo producto  // Método para crear un nuevo producto
  createProduct(productData: {
    title: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: string;
    characteristics: {
      color: string;
      batteryLife: string;
      connectivity: string;
    };
    maxPurchasePerUser: number;
  }) {
    let httpOptions = this._httpOptions.getHttpOptions();

    return this._http.post(`${this.urlProducts}`, productData, httpOptions);
  }

  // Método para actualizar un producto existente
  updateProduct(productId: string, productData: any) {
    let httpOptions = this._httpOptions.getHttpOptions();

    return this._http.put(
      `${this.urlProducts}/${productId}`,
      productData,
      httpOptions
    );
  }

  // Método para eliminar un producto por su ID
  deleteProduct(productId: string) {
    let httpOptions = this._httpOptions.getHttpOptions();

    return this._http.delete(`${this.urlProducts}/${productId}`, httpOptions);
  }
}
