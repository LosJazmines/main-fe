import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@shared/store/selectors/user.selector';
import { filter, take } from 'rxjs/operators';
import { User } from '@apis/auth.service';

export interface Notification {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string;
  title?: string;
  userId?: string;
}

interface DecodedToken {
  id: string;
  role?: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private isConnected = false;
  private userSubscription: Subscription | null = null;

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private socket: Socket,
    private store: Store
  ) {
    console.log('NotificationService initialized');
    this.initializeUserSubscription();
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private initializeUserSubscription() {
    // Unsubscribe from any existing subscription
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    // Subscribe to user changes
    this.userSubscription = this.store.select(selectCurrentUser)
      .pipe(
        filter((user): user is User & { token: string } => 
          user !== null && 
          typeof user === 'object' && 
          'token' in user && 
          typeof user.token === 'string'
        )
      )
      .subscribe(user => {
        console.log('User state changed, initializing socket connection:', user);
        const decodedToken = this.decodeToken(user.token);
        if (decodedToken) {
          const userWithId = {
            ...user,
            id: decodedToken.id,
            role: decodedToken.role
          };
          this.initializeSocketConnection(userWithId);
        } else {
          console.error('Failed to decode user token');
        }
      });
  }

  private initializeSocketConnection(user: User & { role?: string }) {
    console.log('Initializing socket connection for user:', user);
    
    // Clean up existing socket listeners
    this.cleanupSocketListeners();

    if (user?.token) {
      // Handle connection
      this.socket.on('connect', () => {
        console.log('Socket connected for notifications');
        this.isConnected = true;
        if (user.id) {
          this.joinUserRoom(user.id);
        }
        // If user is admin, join admin room
        if (user.role === 'admin') {
          this.socket.emit('joinAdminRoom');
        }
      });

      // Handle disconnection
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected for notifications');
        this.isConnected = false;
      });

      // Handle connection errors
      this.socket.on('connect_error', (error: Error) => {
        console.error('Connection error for notifications:', error);
        this.isConnected = false;
      });

      this.setupSocketListeners();
    } else {
      console.warn('No user token available for notifications');
    }
  }

  private cleanupSocketListeners() {
    // Remove all socket listeners
    this.socket.removeAllListeners('connect');
    this.socket.removeAllListeners('disconnect');
    this.socket.removeAllListeners('connect_error');
    this.socket.removeAllListeners('newNotification');
    this.socket.removeAllListeners('notificationRead');
  }

  private setupSocketListeners() {
    console.log('Setting up socket listeners for notifications');
    this.socket.fromEvent<Notification>('newNotification').subscribe({
      next: (notification) => {
        console.log('New notification received:', notification);
        const currentNotifications = this.notificationsSubject.value;
        currentNotifications.unshift(notification);
        this.notificationsSubject.next(currentNotifications);
        this.updateUnreadCount();
      },
      error: (error) => console.error('Error receiving notification:', error)
    });

    this.socket.fromEvent<string>('notificationRead').subscribe({
      next: (notificationId) => {
        console.log('Notification marked as read:', notificationId);
        const currentNotifications = this.notificationsSubject.value;
        const notification = currentNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          this.notificationsSubject.next(currentNotifications);
          this.updateUnreadCount();
        }
      },
      error: (error) => console.error('Error marking notification as read:', error)
    });
  }

  joinUserRoom(userId: string) {
    if (userId && this.isConnected) {
      console.log('Joining user room for notifications:', userId);
      this.socket.emit('joinUserRoom', userId);
    } else {
      console.warn('Cannot join user room - missing userId or not connected:', { userId, isConnected: this.isConnected });
    }
  }

  markAsRead(notificationId: string) {
    if (this.isConnected) {
      console.log('Emitting markNotificationRead for:', notificationId);
      this.socket.emit('markNotificationRead', notificationId);
    } else {
      console.warn('Cannot mark notification as read - socket not connected');
    }
  }

  markAllAsRead() {
    console.log('Marking all notifications as read');
    const currentNotifications = this.notificationsSubject.value;
    currentNotifications.forEach(notification => {
      notification.read = true;
    });
    this.notificationsSubject.next(currentNotifications);
    this.updateUnreadCount();
    
    if (this.isConnected) {
      this.socket.emit('markAllNotificationsRead');
    } else {
      console.warn('Cannot emit markAllNotificationsRead - socket not connected');
    }
  }

  private updateUnreadCount() {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    console.log('Updating unread count:', unreadCount);
    this.unreadCountSubject.next(unreadCount);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.cleanupSocketListeners();
  }
} 