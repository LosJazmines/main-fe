import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { LucideModule } from '@shared/lucide/lucide.module';
import { WebSocketService } from '@core/services/websocket.service';
import { TokenService } from '@core/services/token.service';
import { MessageService } from '@core/services/snackbar.service';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@shared/store/selectors/user.selector';
import { Subscription } from 'rxjs';
import { NotificationsService } from '@core/services/notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
  templateUrl: './notifications.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  hasUnreadNotifications = false;
  isWebSocketConnected = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private webSocketService: WebSocketService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private store: Store
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.checkAuthAndInitSocket();
  }

  private checkAuthAndInitSocket() {
    const sub = this.store.select(selectCurrentUser).subscribe(user => {
      const token = this.tokenService.getToken();
      
      if (user && token) {
        this.setupWebSocketConnection();
      }
    });
    this.subscriptions.push(sub);
  }

  private setupWebSocketConnection() {
    const token = this.tokenService.getToken();
    if (!token) return;

    this.webSocketService.connect(token);

    const connectionSub = this.webSocketService.getConnectionStatus().subscribe(
      connected => {
        this.isWebSocketConnected = connected;
        if (connected) {
          this.setupWebSocketListeners();
          this.messageService.showSuccess(
            'Conexión WebSocket establecida',
            'top right',
            3000
          );
        } else {
          this.messageService.showError(
            'Conexión WebSocket perdida',
            'top right',
            3000
          );
        }
      }
    );

    this.subscriptions.push(connectionSub);
  }

  private setupWebSocketListeners() {
    const notificationSub = this.webSocketService.getNotifications().subscribe(notification => {
      if (notification) {
        this.notifications = [notification, ...this.notifications];
        this.updateUnreadStatus();
        this.messageService.showSuccess(
          'Nueva notificación recibida',
          'top right',
          5000
        );
      }
    });

    this.subscriptions.push(notificationSub);
  }

  private loadNotifications() {
    const sub = this.notificationsService.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.updateUnreadStatus();
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.messageService.showError(
          'Error al cargar las notificaciones',
          'top right',
          3000
        );
      }
    });
    this.subscriptions.push(sub);
  }

  private updateUnreadStatus() {
    this.hasUnreadNotifications = this.notifications.some(n => !n.read);
  }

  markAsRead(notification: any) {
    const sub = this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.updateUnreadStatus();
        this.messageService.showSuccess(
          'Notificación marcada como leída',
          'top right',
          3000
        );
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
        this.messageService.showError(
          'Error al marcar la notificación como leída',
          'top right',
          3000
        );
      }
    });
    this.subscriptions.push(sub);
  }

  markAllAsRead() {
    const sub = this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.updateUnreadStatus();
        this.messageService.showSuccess(
          'Todas las notificaciones marcadas como leídas',
          'top right',
          3000
        );
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
        this.messageService.showError(
          'Error al marcar todas las notificaciones como leídas',
          'top right',
          3000
        );
      }
    });
    this.subscriptions.push(sub);
  }

  viewDetails(notification: any) {
    if (notification.type === 'ORDER' && notification.relatedId) {
      this.router.navigate(['/admin/orders', notification.relatedId]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
} 