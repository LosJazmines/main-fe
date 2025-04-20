import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../interfaces/notification.interface';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = `${environment.api}/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private wsService: WebSocketService
  ) {
    this.setupWebSocketListeners();
    console.log('NotificationService initialized');
  }

  private setupWebSocketListeners(): void {
    this.wsService.getNotifications().subscribe({
      next: (notification: Notification) => {
        this.addNotification(notification);
      },
      error: (error) => console.error('Error in notification socket:', error)
    });
  }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/admin`).pipe(
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      })
    );
  }

  getUserNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      })
    );
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.value;
        const notification = currentNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          this.notificationsSubject.next(currentNotifications);
          this.updateUnreadCount();
        }
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.value;
        currentNotifications.forEach(notification => {
          notification.read = true;
        });
        this.notificationsSubject.next(currentNotifications);
        this.updateUnreadCount();
      })
    );
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`).pipe(
      tap(() => {
        const currentNotifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
        this.notificationsSubject.next(currentNotifications);
        this.updateUnreadCount();
      })
    );
  }

  private updateUnreadCount(): void {
    const currentNotifications = this.notificationsSubject.value;
    const unreadCount = currentNotifications.filter(notification => notification && !notification.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  private addNotification(notification: Notification) {
    const currentNotifications = this.notificationsSubject.value;
    currentNotifications.unshift(notification);
    this.notificationsSubject.next(currentNotifications);
    this.updateUnreadCount();
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
  }
} 