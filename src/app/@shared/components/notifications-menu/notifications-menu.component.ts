import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { LucideModule } from '@shared/lucide/lucide.module';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationsService } from '@core/services/notifications.service';
import { Notification } from '@core/interfaces/notification.interface';

@Component({
  selector: 'app-notifications-menu',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
  template: `
    <button 
      mat-icon-button 
      [matMenuTriggerFor]="notificationsMenu"
      [matBadge]="unreadCount"
      [matBadgeHidden]="unreadCount === 0"
      matBadgeColor="warn"
      class="relative"
    >
      <lucide-icon name="bell"></lucide-icon>
    </button>

    <mat-menu #notificationsMenu="matMenu" class="notification-menu">
      <div class="p-4 min-w-[300px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Notificaciones</h3>
          <button
            mat-button
            color="primary"
            (click)="markAllAsRead()"
            *ngIf="unreadCount > 0"
            class="text-[#3a5a40]"
          >
            Marcar todo como leído
          </button>
        </div>

        <div class="max-h-[400px] overflow-y-auto">
          <ng-container *ngIf="notifications.length > 0; else noNotifications">
            <div
              *ngFor="let notification of notifications"
              class="p-3 border-b border-gray-200 last:border-0 cursor-pointer hover:bg-gray-50"
              [ngClass]="{ 'bg-[#3a5a40]/5': !notification.read }"
              (click)="viewDetails(notification)"
            >
              <div class="flex items-start gap-3">
                <div class="rounded-full p-2" [ngClass]="!notification.read ? 'bg-[#3a5a40]/10' : 'bg-gray-100'">
                  <lucide-icon 
                    [name]="notification.type === 'ORDER' ? 'shopping-cart' : 'mail'"
                    [ngClass]="!notification.read ? 'text-[#3a5a40]' : 'text-gray-500'"
                    size="16"
                  ></lucide-icon>
                </div>
                <div class="flex-1">
                  <h4 class="text-sm font-medium">{{ notification.title || 'Nueva notificación' }}</h4>
                  <p class="text-sm text-gray-600 line-clamp-2">{{ notification.message }}</p>
                  <span class="text-xs text-gray-500 mt-1">{{ notification.createdAt | date:'short' }}</span>
                </div>
              </div>
            </div>
          </ng-container>
          <ng-template #noNotifications>
            <div class="text-center py-6">
              <lucide-icon name="bell-off" size="24" class="text-gray-400 mx-auto mb-2"></lucide-icon>
              <p class="text-gray-500">No hay notificaciones</p>
            </div>
          </ng-template>
        </div>

        <div class="mt-4 text-center">
          <button
            mat-button
            color="primary"
            class="text-[#3a5a40]"
            (click)="viewAllNotifications()"
          >
            Ver todas
          </button>
        </div>
      </div>
    </mat-menu>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    ::ng-deep .notification-menu {
      max-width: none !important;
    }
  `]
})
export class NotificationsMenuComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private subscription = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadNotifications() {
    this.subscription.add(
      this.notificationsService.getAllNotifications().subscribe({
        next: (notifications) => {
          this.notifications = notifications.slice(0, 5); // Show only last 5 notifications
          this.updateUnreadCount();
        }
      })
    );
  }

  private setupSubscriptions() {
    this.subscription.add(
      this.notificationsService.notifications$.subscribe({
        next: (notification) => {
          if (!Array.isArray(notification)) {
            this.notifications.unshift(notification as Notification);
            this.notifications = this.notifications.slice(0, 5);
            this.updateUnreadCount();
          }
        }
      })
    );

    this.subscription.add(
      this.notificationsService.unreadCount$.subscribe({
        next: (count) => {
          this.unreadCount = count;
        }
      })
    );
  }

  private updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead() {
    this.subscription.add(
      this.notificationsService.markAllAsRead().subscribe({
        next: () => {
          this.notifications.forEach(n => n.read = true);
          this.updateUnreadCount();
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

  viewAllNotifications() {
    this.router.navigate(['/admin/notifications']);
  }
} 