import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { LucideModule } from '@shared/lucide/lucide.module';
import { ContactService } from '@shared/services/contact.service';
import { ContactMessage } from '@shared/models/contact-message.model';
import { AdminHeaderStore } from '../../stores/admin-header.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, interval, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAdmin } from '@shared/store/selectors/user.selector';
import { take, finalize, catchError } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule,
        LucideModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './messages.component.html',
})
export default class MessagesComponent implements OnInit, OnDestroy {
    messages: ContactMessage[] = [];
    isLoading = true;
    private destroy$ = new Subject<void>();
    private refreshInterval = 5 * 60 * 1000; // 5 minutos
    private intervalSubscription: any;
    refreshing$ = new BehaviorSubject<boolean>(false);

    constructor(
        private contactService: ContactService,
        private adminHeaderStore: AdminHeaderStore,
        private snackBar: MatSnackBar,
        private router: Router,
        private store: Store
    ) { }

    ngOnInit() {
        this.checkAdminAndInitialize();
    }

    ngOnDestroy() {
        if (this.intervalSubscription) {
            this.intervalSubscription.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    private checkAdminAndInitialize() {
        this.store.select(selectIsAdmin)
            .pipe(
                take(1),
                takeUntil(this.destroy$),
            )
            .subscribe(isAdmin => {
                if (isAdmin) {
                    this.adminHeaderStore.updateHeaderTitle('Mensajes');
                    this.loadMessages();
                    this.setupAutoRefresh();
                }
            });
    }

    private setupAutoRefresh() {
        this.intervalSubscription = interval(this.refreshInterval)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (!this.refreshing$.value) {
                    this.refreshMessages();
                }
            });
    }

    private showNotification(message: string) {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }

    loadMessages(isRefresh = false) {
        if (!isRefresh) {
            this.isLoading = true;
        }
        
        this.contactService.getMessages()
            .pipe(
                takeUntil(this.destroy$),
                finalize(() => {
                    this.isLoading = false;
                    this.refreshing$.next(false);
                })
            )
            .subscribe({
                next: (messages) => {
                    this.messages = messages.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    });
                    if (isRefresh) {
                        this.showNotification('Mensajes actualizados');
                    }
                },
                error: (error) => {
                    console.error('Error al cargar mensajes:', error);
                    this.showNotification('Error al cargar los mensajes');
                }
            });
    }

    markAsRead(id: string) {
        this.contactService.markAsRead(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const message = this.messages.find(m => m.id === id);
                    if (message) {
                        message.read = true;
                    }
                },
                error: (error) => {
                    console.error('Error al marcar mensaje como leído:', error);
                    this.showNotification('Error al marcar el mensaje como leído');
                }
            });
    }

    deleteMessage(id: string) {
        if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
            this.contactService.deleteMessage(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.messages = this.messages.filter(m => m.id !== id);
                        this.showNotification('Mensaje eliminado correctamente');
                    },
                    error: (error) => {
                        console.error('Error al eliminar mensaje:', error);
                        this.showNotification('Error al eliminar el mensaje');
                    }
                });
        }
    }

    refreshMessages() {
        this.refreshing$.next(true);
        this.loadMessages(true);
    }

    manualRefresh() {
        if (!this.refreshing$.value) {
            this.refreshMessages();
        }
    }
} 