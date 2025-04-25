import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../../@apis/notifications.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { LucideModule } from '../../lucide/lucide.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, MatButtonModule, MatIconModule],
  template: `
    <div class="notifications-container">
      <h2>Notificaciones</h2>
      <div *ngIf="notifications.length === 0" class="no-notifications">
        No hay notificaciones
      </div>
      <div *ngFor="let notification of notifications" class="notification-card">
        <div class="notification-content">
          <div class="notification-header">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-actions">
              <button mat-icon-button (click)="markAsRead(notification.id)" *ngIf="!notification.read">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteNotification(notification.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          <div class="notification-message">{{ notification.message }}</div>
          <div class="notification-date">{{ notification.createdAt | date:'medium' }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .notification-card {
      background: white;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .notification-title {
      font-weight: bold;
    }
    .notification-actions {
      display: flex;
      gap: 8px;
    }
    .notification-message {
      color: #666;
      margin-bottom: 5px;
    }
    .notification-date {
      font-size: 0.8em;
      color: #999;
    }
    .no-notifications {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationsService.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  markAsRead(notificationId: string) {
    this.notificationsService.markAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  deleteNotification(notificationId: string) {
    this.notificationsService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }
} 