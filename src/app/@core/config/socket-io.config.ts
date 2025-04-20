import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../../../environments/environment';

export const socketIoConfig: SocketIoConfig = {
  url: environment.wsUrl,
  options: {
    path: '/socket.io',
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
    forceNew: true
  }
}; 