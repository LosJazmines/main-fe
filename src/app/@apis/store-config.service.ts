import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CategoryConfig } from '@core/models/category-config.model';
import { TagConfig } from '@core/models/tag-config.model';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@shared/store/selectors/user.selector';
import { switchMap, map, catchError, distinctUntilChanged, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreConfigService {
  private publicApiUrl = `${environment.api}/public/store`;
  private apiUrl = `${environment.api}/store`;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  private getHeaders(): Observable<HttpHeaders> {
    return this.store.select(selectCurrentUser).pipe(
      distinctUntilChanged(),
      map((user: { token?: string } | null) => {
        const headers = new HttpHeaders();
        if (user?.token) {
          return headers.set('Authorization', `Bearer ${user.token}`);
        }
        return headers;
      })
    );
  }

  // Public endpoints
  getCategories(): Observable<CategoryConfig[]> {
    return this.http.get<CategoryConfig[]>(`${this.publicApiUrl}/categories`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  getTags(): Observable<TagConfig[]> {
    const url = `${this.publicApiUrl}/tags`;
    console.log('Fetching tags from URL:', url);
    return this.http.get<TagConfig[]>(url).pipe(
      tap(tags => console.log('Raw API response:', tags)),
      catchError(error => {
        console.error('Error fetching tags:', error);
        return of([]);
      })
    );
  }

  // Authenticated endpoints
  getCategory(uuid: string): Observable<CategoryConfig> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.get<CategoryConfig>(`${this.apiUrl}/categories/${uuid}`, { headers }).pipe(
          catchError(error => {
            console.error(`Error fetching category ${uuid}:`, error);
            return throwError(() => error);
          })
        )
      )
    );
  }

  createCategory(category: Partial<CategoryConfig>): Observable<CategoryConfig> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.post<CategoryConfig>(`${this.apiUrl}/categories`, category, { headers }).pipe(
          catchError(error => {
            console.error('Error creating category:', error);
            return throwError(() => error);
          })
        )
      )
    );
  }

  updateCategory(uuid: string, category: Partial<CategoryConfig>): Observable<CategoryConfig> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.put<CategoryConfig>(`${this.apiUrl}/categories/${uuid}`, category, { headers }).pipe(
          catchError(error => {
            console.error(`Error updating category ${uuid}:`, error);
            return throwError(() => error);
          })
        )
      )
    );
  }

  deleteCategory(uuid: string): Observable<void> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.delete<void>(`${this.apiUrl}/categories/${uuid}`, { headers }).pipe(
          catchError(error => {
            console.error(`Error deleting category ${uuid}:`, error);
            return throwError(() => error);
          })
        )
      )
    );
  }

  createTag(tag: Partial<TagConfig>): Observable<TagConfig> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.post<TagConfig>(`${this.apiUrl}/tags`, tag, { headers }).pipe(
          catchError(error => {
            console.error('Error creating tag:', error);
            return throwError(() => error);
          })
        )
      )
    );
  }

  updateTag(uuid: string, tag: Partial<TagConfig>): Observable<TagConfig> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.put<TagConfig>(`${this.apiUrl}/tags/${uuid}`, tag, { headers }).pipe(
          catchError(error => {
            console.error(`Error updating tag ${uuid}:`, error);
            return throwError(() => error);
          })
        )
      )
    );
  }

  deleteTag(uuid: string): Observable<void> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.delete<void>(`${this.apiUrl}/tags/${uuid}`, { headers }).pipe(
          catchError(error => {
            console.error(`Error deleting tag ${uuid}:`, error);
            return throwError(() => error);
          })
        )
      )
    );
  }
} 