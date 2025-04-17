import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StoreConfig, Category, Tag } from '../types/store-config';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../../../@core/services/snackbar.service';
import { TypeSnackBarPosition } from '../../../@core/types/snackbar.types';

@Injectable({
  providedIn: 'root'
})
export class StoreConfigService {
  private apiUrl = `${environment.api}/store-config`;

  constructor(
    private http: HttpClient,
    private _messageService: MessageService
  ) {}

  // Store Config
  getStoreConfig(): Observable<StoreConfig> {
    return this.http.get<StoreConfig>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error loading store config:', error);
        throw error;
      })
    );
  }

  updateStoreConfig(config: Partial<StoreConfig>): Observable<StoreConfig> {
    return this.http.put<StoreConfig>(`${this.apiUrl}`, config);
  }

  // Banners
  uploadBanner(file: File, type: 'home' | 'store'): Observable<StoreConfig> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<StoreConfig>(`${this.apiUrl}/banner/${type}`, formData);
  }

  updateBannerOrder(type: 'home' | 'store', images: { url: string; order: number }[]): Observable<StoreConfig> {
    return this.http.put<StoreConfig>(`${this.apiUrl}/banner/${type}/order`, images);
  }

  deleteBanner(type: 'home' | 'store', imageUrl: string): Observable<StoreConfig> {
    return this.http.delete<StoreConfig>(`${this.apiUrl}/banner/${type}/${encodeURIComponent(imageUrl)}`);
  }

  // Categories
  getCategories(isActive?: boolean): Observable<Category[]> {
    const params = isActive !== undefined ? new HttpParams().set('isActive', isActive.toString()) : undefined;
    return this.http.get<Category[]>(`${this.apiUrl}/categories`, { params });
  }

  createCategory(category: { name: string }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(uuid: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${uuid}`, category);
  }

  deleteCategory(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${uuid}`);
  }

  // Tags
  getTags(type?: 'flower' | 'plant' | 'extra', isActive?: boolean): Observable<Tag[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (isActive !== undefined) params = params.set('isActive', isActive.toString());
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`, { params });
  }

  createTag(tag: { name: string; type: 'flower' | 'plant' | 'extra' }): Observable<Tag> {
    return this.http.post<Tag>(`${this.apiUrl}/tags`, tag);
  }

  updateTag(uuid: string, tag: Partial<Tag>): Observable<Tag> {
    return this.http.put<Tag>(`${this.apiUrl}/tags/${uuid}`, tag);
  }

  deleteTag(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${uuid}`);
  }
} 