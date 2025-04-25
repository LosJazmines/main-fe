import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  isActive: boolean;
  createdAt?: Date;
  roles: string[];
  googleId?: string;
  avatar?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.api}/user`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        token = localStorage.getItem('token') || '';
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all users with pagination
  getUsers(page: number = 1, limit: number = 10): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Get user by email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`, { headers: this.getHeaders() });
  }

  // Create new user
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData, { headers: this.getHeaders() });
  }

  // Update user
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() });
  }

  // Delete user (soft delete)
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Restore deleted user
  restoreUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/restore/${id}`, {}, { headers: this.getHeaders() });
  }

  // Toggle user status
  toggleUserStatus(id: string, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, { isActive }, { headers: this.getHeaders() });
  }
}
