import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from '../services/snackbar.service';
import { Store } from '@ngrx/store';
import { setCurrentUser } from '../store/actions/user.actions';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private _messageService: MessageService,
    private _router: Router,
    private store: Store
  ) {}

  // TODO: Organizar que los Mensajes de error sean los correctos

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errStatus = error.status;

        // TODO: Redirigir al Login
        // errStatus = 401 Token vencido o no autenticado

        let errorMessage: string;

        switch (errStatus) {
          case 400:
            errorMessage = 'Datos incorrectos, Por favor vuelva a intentar.';
            break;

          case 401:
            errorMessage =
              'Tu sesión ha expirado o no estás autenticado. Por favor, inicia sesión.';
            localStorage.setItem('user', '');
            this.store.dispatch(setCurrentUser({ currentUser: null }));
            this._router.navigate(['']);
            break;

          case 502:
            errorMessage = 'Error en el servidor';

            break;

          // TODO: Agregar casos adicionales según sea necesario
          // Puedes manejar otros códigos de estado aquí si es necesario.

          default:
            // TODO: Manejar otros casos de error según sea necesario
            // Por ejemplo, podrías mostrar un mensaje genérico de error.
            errorMessage =
              'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
            break;
        }

        this._messageService.showError(
          errorMessage,
          'top center',
          15000,
          'Aceptar'
        );

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
