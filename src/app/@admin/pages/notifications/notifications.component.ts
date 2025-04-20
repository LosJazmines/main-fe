import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { LucideModule } from '@shared/lucide/lucide.module';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from '@core/services/notifications.service';
import { Notification } from '@core/interfaces/notification.interface';
import { AuthService } from '@apis/auth.service';
import { MessageService } from '@core/services/snackbar.service';

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
  notifications: Notification[] = [];
  hasUnreadNotifications = false;
  private subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.messageService.showError('Por favor inicia sesión para ver las notificaciones', 'top right', 5000);
      this.router.navigate(['/auth/login']);
      return;
    }
    this.loadNotifications();
    this.setupNotificationSubscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadNotifications() {
    this.subscription.add(
      this.notificationsService.getAllNotifications().subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.updateUnreadStatus();
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          if (error.status === 401) {
            this.messageService.showError('Sesión expirada. Por favor inicia sesión nuevamente', 'top right', 5000);
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        }
      })
    );
  }

  private setupNotificationSubscription() {
    this.subscription.add(
      this.notificationsService.notifications$.subscribe({
        next: (notification) => {
          if (!Array.isArray(notification)) {
            this.notifications.unshift(notification as Notification);
            this.updateUnreadStatus();
          }
        }
      })
    );
  }

  private updateUnreadStatus() {
    this.hasUnreadNotifications = this.notifications.some(n => !n.read);
  }

  markAsRead(notification: Notification) {
    this.subscription.add(
      this.notificationsService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read = true;
          this.updateUnreadStatus();
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
          if (error.status === 401) {
            this.messageService.showError('Sesión expirada. Por favor inicia sesión nuevamente', 'top right', 5000);
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        }
      })
    );
  }

  markAllAsRead() {
    this.subscription.add(
      this.notificationsService.markAllAsRead().subscribe({
        next: () => {
          this.notifications.forEach(n => n.read = true);
          this.updateUnreadStatus();
        },
        error: (error) => {
          console.error('Error marking all notifications as read:', error);
          if (error.status === 401) {
            this.messageService.showError('Sesión expirada. Por favor inicia sesión nuevamente', 'top right', 5000);
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          }
        }
      })
    );
  }

  viewDetails(notification: Notification) {
    if (notification.type === 'ORDER' && notification.relatedId) {
      this.router.navigate(['/admin/orders', notification.relatedId]);
    } else if (notification.type === 'CONTACT' && notification.relatedId) {
      this.router.navigate(['/admin/contact', notification.relatedId]);
    }
  }
} 