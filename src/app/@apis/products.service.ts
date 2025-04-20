import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.dev';
import { Observable } from 'rxjs';

export interface ProductFilters {
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: 'ascendente' | 'descendente' | 'mayorValor' | 'menorValor';
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  urlProducts: string = `${environment.api}/product`;

  constructor(private _http: HttpClient) { }

  getProductsFindActive(filters?: ProductFilters): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.tag) {
        params = params.set('tag', filters.tag);
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        params = params.set('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        params = params.set('maxPrice', filters.maxPrice.toString());
      }
    }

    return this._http.get(`${this.urlProducts}/active`, {
      headers: headers,
      params: params
    });
  }

  getAllProducts(filters?: ProductFilters) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let params = new HttpParams();
    
    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      if (filters.tag) {
        params = params.set('tag', filters.tag);
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        params = params.set('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        params = params.set('maxPrice', filters.maxPrice.toString());
      }
    }

    return this._http.get(`${this.urlProducts}`, {
      headers: headers,
      params: params
    });
  }

  getProductById(productId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.get(`${this.urlProducts}/${productId}`, {
      headers: headers,
    });
  }

  // Método para crear un nuevo producto  // Método para crear un nuevo producto
  createProduct(productData: FormData) {
    return this._http.post(`${this.urlProducts}`, productData);
  }

  // createProduct(productData: {
  //   name: string;
  //   description: string;
  //   price: number;
  //   stock: number;
  //   images: string[];
  //   category: string;
  //   characteristics: {
  //     color: string;
  //     batteryLife: string;
  //     connectivity: string;
  //   };
  //   maxPurchasePerUser: number;
  // }) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this._http.post(`${this.urlProducts}`, productData, {
  //     headers: headers,
  //   });
  // }

  // Método para actualizar un producto existente
  // updateProduct(productId: string, productData: any) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this._http.put(`${this.urlProducts}/${productId}`, productData, {
  //     headers: headers,
  //   });
  // }

  updateProduct(productId: string, productData: any) {
    return this._http.patch(`${this.urlProducts}/${productId}`, productData);
  }

  // Método mejorado para buscar productos con filtros dinámicos
  searchProducts(filters: {
    searchTerm?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // Limpia filtros vacíos para no afectar la API
    const cleanedFilters: any = {};
    (Object.keys(filters) as (keyof typeof filters)[]).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== '' &&
        filters[key] !== 0
      ) {
        cleanedFilters[key] = filters[key];
      }
    });

    return this._http.post(`${this.urlProducts}/search`, cleanedFilters, {
      headers,
    });
  }

  // Método para eliminar un producto por su ID
  deleteProduct(productId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this._http.delete(`${this.urlProducts}/${productId}`, {
      headers: headers,
    });
  }

  deleteImage(productId: string, imageId: string) {
    return this._http.delete(`${this.urlProducts}/${productId}/images/${imageId}`);
  }
}
