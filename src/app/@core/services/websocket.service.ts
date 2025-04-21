import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { default as io } from 'socket.io-client';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@shared/store/selectors/user.selector';
import { Order } from '../../@admin/core/components/order-card-row/order-card-row.component';
import { AuthService } from '@apis/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private ordersSocket: any = null;
  private notificationsSocket: any = null;
  private contactSocket: any = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private storeSubscription: Subscription | null = null;
  private isConnecting = false;

  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private newOrders$ = new BehaviorSubject<Order | null>(null);
  private orderUpdates$ = new BehaviorSubject<Order | null>(null);
  private orderStatusChanges$ = new BehaviorSubject<Order | null>(null);
  private notifications$ = new BehaviorSubject<any>(null);
  private adminNotifications$ = new BehaviorSubject<any>(null);

  constructor(
    private store: Store,
    private authService: AuthService
  ) {
    console.log('WebSocketService initialized');
    this.setupStoreSubscription();
  }

  private setupStoreSubscription() {
    console.log('Setting up store subscription');
    this.storeSubscription = this.store.select(selectCurrentUser).subscribe(user => {
      console.log('user', user);
      console.log('User state changed:', user ? 'authenticated' : 'not authenticated');
      
      // Get the token from the auth service if not in the user object
      const token = user?.token || this.authService.getToken();
      if (token) {
        this.connect(token);
      } else {
        this.disconnect();
      }
    });
  }

  connect(token: string) {
    if (this.isConnected || this.isConnecting) {
      console.log('Already connected or connecting, skipping connection attempt');
      return;
    }

    this.isConnecting = true;
    console.log('Attempting to connect to WebSocket servers');

    try {
      // Clean up existing connections
      this.disconnect();

      const socketOptions = {
        transports: ['websocket', 'polling'],
        auth: {
          token: `Bearer ${token}`
        },
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        forceNew: true
      };

      // Connect to Orders namespace
      this.ordersSocket = io(`${environment.wsUrl}`, {
        ...socketOptions,
        path: '/socket.io/orders'
      });

      // Connect to Notifications namespace
      this.notificationsSocket = io(`${environment.wsUrl}`, {
        ...socketOptions,
        path: '/socket.io/notifications'
      });

      // Connect to Contact namespace
      this.contactSocket = io(`${environment.wsUrl}`, {
        ...socketOptions,
        path: '/socket.io/contact'
      });

      this.setupSocketListeners();

    } catch (error) {
      console.error('Error creating WebSocket connections:', error);
      this.isConnecting = false;
      this.handleConnectionError();
    }
  }

  private setupSocketListeners() {
    // Orders socket listeners
    if (this.ordersSocket) {
      this.ordersSocket.on('connect', () => {
        console.log('Orders socket connected:', this.ordersSocket?.id);
        this.updateConnectionStatus();
      });

      this.ordersSocket.on('disconnect', (reason: string) => {
        console.log('Orders socket disconnected:', reason);
        this.updateConnectionStatus();
        if (reason !== 'io client disconnect') {
          this.handleDisconnect();
        }
      });

      this.ordersSocket.on('connect_error', (error: Error) => {
        console.error('Orders socket connection error:', error);
        this.handleConnectionError();
      });

      this.ordersSocket.on('newOrder', (order: Order) => {
        console.log('New order received:', order);
        if (order) {
          this.newOrders$.next(order);
        }
      });

      this.ordersSocket.on('orderUpdate', (order: Order) => {
        console.log('Order update received:', order);
        if (order) {
          this.orderUpdates$.next(order);
        }
      });

      this.ordersSocket.on('orderStatusChange', (order: Order) => {
        console.log('Order status change received:', order);
        if (order) {
          this.orderStatusChanges$.next(order);
        }
      });
    }

    // Notifications socket listeners
    if (this.notificationsSocket) {
      this.notificationsSocket.on('connect', () => {
        console.log('Notifications socket connected:', this.notificationsSocket?.id);
        this.updateConnectionStatus();
        
        // Join the notifications room for the current user
        const userId = this.authService.getCurrentUser()?.id;
        if (userId) {
          console.log('Joining notifications room for user:', userId);
          this.notificationsSocket.emit('joinNotificationsRoom', userId);
        }

        // Join admin room if user is admin
        const userRole = this.authService.getCurrentUser()?.role;
        console.log('Current user role:', userRole);
        if (userRole === 'admin') {
          console.log('Joining admin notifications room');
          this.notificationsSocket.emit('joinAdminRoom');
          
          // Add confirmation listener for admin room
          this.notificationsSocket.on('adminRoomJoined', () => {
            console.log('Successfully joined admin room');
          });
        } else {
          console.log('User is not admin, skipping admin room');
        }
      });

      this.notificationsSocket.on('disconnect', (reason: string) => {
        console.log('Notifications socket disconnected:', reason);
        this.updateConnectionStatus();
      });

      // Update event name from 'newNotification' to 'notification'
      this.notificationsSocket.on('notification', (notification: any) => {
        console.log('New notification received (notification event):', notification);
        this.notifications$.next(notification);
      });

      // Keep listening to 'newNotification' for backward compatibility
      this.notificationsSocket.on('newNotification', (notification: any) => {
        console.log('New notification received (newNotification event):', notification);
        this.notifications$.next(notification);
      });

      this.notificationsSocket.on('notificationRead', (data: { notificationId: string }) => {
        console.log('Notification marked as read:', data);
        // Handle notification read event if needed
      });

      this.notificationsSocket.on('newAdminNotification', (notification: any) => {
        console.log('New admin notification received:', notification);
        if (notification) {
          console.log('Admin notification details:', {
            type: notification.type,
            message: notification.message,
            timestamp: notification.timestamp
          });
          this.adminNotifications$.next(notification);
        } else {
          console.warn('Received empty admin notification');
        }
      });

      // Add error event listener
      this.notificationsSocket.on('error', (error: any) => {
        console.error('Notifications socket error:', error);
      });
    }

    // Contact socket listeners
    if (this.contactSocket) {
      this.contactSocket.on('connect', () => {
        console.log('Contact socket connected:', this.contactSocket?.id);
        this.updateConnectionStatus();
      });

      this.contactSocket.on('disconnect', (reason: string) => {
        console.log('Contact socket disconnected:', reason);
        this.updateConnectionStatus();
      });
    }
  }

  private updateConnectionStatus() {
    const isConnected = 
      (this.ordersSocket?.connected || false) ||
      (this.notificationsSocket?.connected || false) ||
      (this.contactSocket?.connected || false);

    this.isConnected = isConnected;
    this.isConnecting = false;
    this.connectionStatus$.next(isConnected);
    
    if (isConnected) {
      console.log('WebSocket connection established successfully');
      this.reconnectAttempts = 0;
    }
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnecting) {
      this.reconnectAttempts++;
      const delay = this.reconnectInterval * Math.min(this.reconnectAttempts, 3);
      console.log(`Scheduled reconnection in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (!this.isConnected && !this.isConnecting) {
          this.store.select(selectCurrentUser).subscribe(user => {
            if (user?.token) {
              this.connect(user.token);
            }
          }).unsubscribe();
        }
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached, stopping reconnection attempts');
      this.reconnectAttempts = 0;
    }
  }

  private handleConnectionError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnecting) {
      this.reconnectAttempts++;
      const delay = this.reconnectInterval * Math.min(this.reconnectAttempts, 3);
      console.log(`Scheduled reconnection after error in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (!this.isConnected && !this.isConnecting) {
          this.store.select(selectCurrentUser).subscribe(user => {
            if (user?.token) {
              this.connect(user.token);
            }
          }).unsubscribe();
        }
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached after error, stopping reconnection attempts');
      this.reconnectAttempts = 0;
    }
  }

  disconnect() {
    if (this.ordersSocket) {
      this.ordersSocket.disconnect();
      this.ordersSocket = null;
    }
    if (this.notificationsSocket) {
      this.notificationsSocket.disconnect();
      this.notificationsSocket = null;
    }
    if (this.contactSocket) {
      this.contactSocket.disconnect();
      this.contactSocket = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.connectionStatus$.next(false);
  }

  ngOnDestroy() {
    console.log('WebSocketService being destroyed');
    this.disconnect();
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  getNewOrders(): Observable<Order | null> {
    return this.newOrders$.asObservable();
  }

  getOrderUpdates(): Observable<Order | null> {
    return this.orderUpdates$.asObservable();
  }

  getOrderStatusChanges(): Observable<Order | null> {
    return this.orderStatusChanges$.asObservable();
  }

  getNotifications(): Observable<any> {
    return this.notifications$.asObservable();
  }

  getAdminNotifications(): Observable<any> {
    return this.adminNotifications$.asObservable();
  }

  markNotificationAsRead(notificationId: string) {
    if (this.notificationsSocket?.connected) {
      const userId = this.authService.getCurrentUser()?.id;
      if (userId) {
        this.notificationsSocket.emit('notificationRead', { notificationId, userId });
      }
    }
  }
} 