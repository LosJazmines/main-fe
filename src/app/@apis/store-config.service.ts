import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryConfig } from '@core/models/category-config.model';
import { TagConfig } from '@core/models/tag-config.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreConfigService {
  private apiUrl = `${environment.api}/store-config`;

  constructor(private http: HttpClient) {}

  // Categories
  getCategories(): Observable<CategoryConfig[]> {
    return this.http.get<CategoryConfig[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: Partial<CategoryConfig>): Observable<CategoryConfig> {
    return this.http.post<CategoryConfig>(`${this.apiUrl}/categories`, category);
  }

  bulkCreateCategories(categories: Partial<CategoryConfig>[]): Observable<CategoryConfig[]> {
    return this.http.post<CategoryConfig[]>(`${this.apiUrl}/categories/bulk`, categories);
  }

  updateCategory(uuid: string, category: Partial<CategoryConfig>): Observable<CategoryConfig> {
    return this.http.put<CategoryConfig>(`${this.apiUrl}/categories/${uuid}`, category);
  }

  deleteCategory(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${uuid}`);
  }

  // Tags
  getTags(type?: 'flower' | 'plant' | 'extra'): Observable<TagConfig[]> {
    const url = type ? `${this.apiUrl}/tags?type=${type}` : `${this.apiUrl}/tags`;
    return this.http.get<TagConfig[]>(url);
  }

  createTag(tag: Partial<TagConfig>): Observable<TagConfig> {
    return this.http.post<TagConfig>(`${this.apiUrl}/tags`, tag);
  }

  bulkCreateTags(tags: Partial<TagConfig>[]): Observable<TagConfig[]> {
    return this.http.post<TagConfig[]>(`${this.apiUrl}/tags/bulk`, tags);
  }

  updateTag(uuid: string, tag: Partial<TagConfig>): Observable<TagConfig> {
    return this.http.put<TagConfig>(`${this.apiUrl}/tags/${uuid}`, tag);
  }

  deleteTag(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tags/${uuid}`);
  }
} 