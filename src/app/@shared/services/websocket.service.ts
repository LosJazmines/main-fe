import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactMessage } from '../models/contact-message.model';
import { Store } from '@ngrx/store';
import { selectIsAdmin } from '../store/selectors/user.selector';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private socket: any;
    private connectionStatus = new BehaviorSubject<boolean>(false);
    connectionStatus$ = this.connectionStatus.asObservable();

    constructor(private store: Store) {
        this.socket = io(environment.api, {
            auth: { token: null },
            autoConnect: false
        });

        this.socket.on('connect', () => {
            console.log('WebSocket Connected');
            this.connectionStatus.next(true);
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket Disconnected');
            this.connectionStatus.next(false);
        });

        this.socket.on('error', (error: Error) => {
            console.error('WebSocket Error:', error);
            this.connectionStatus.next(false);
        });

        // Verificar si el usuario es admin y conectar
        this.store.select(selectIsAdmin).pipe(take(1)).subscribe(isAdmin => {
            if (isAdmin) {
                this.connect();
            }
        });
    }

    connect() {
        this.socket.connect();
    }

    disconnect() {
        this.socket.disconnect();
    }

    joinAdminRoom() {
        this.socket.emit('joinAdminRoom');
    }

    onNewMessage(): Observable<ContactMessage> {
        return new Observable(observer => {
            this.socket.on('newMessage', (message: ContactMessage) => {
                observer.next(message);
            });

            return () => {
                this.socket.off('newMessage');
            };
        });
    }

    isConnected(): boolean {
        return this.socket.connected;
    }
} 