import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../services/snackbar.service';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

export const catchErrorHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const _messageService = inject(MessageService);
  const _router = inject(Router);
  const _dialog = inject(MatDialog);

  return next(req).pipe(
    catchError((error) => {
      console.log('Hola desde el interceptor', { error });

      let errStatus = error.status;
      let errorMessage: string;

      switch (errStatus) {
        case 401:
          if (_router.url !== '/') {
            _router.navigate(['/']);
            errorMessage = error.error.message.toString();
            _messageService.showError(
              errorMessage,
              'bottom right',
              15000,
              'aceptar'
            );
          }
          break;

        case 0:
          errorMessage = `Por favor comunicarse con Sistemas, ${error.status} ${error.message}`;
          console.log({ errorMessage }, 'entre a 0');

          _messageService.showError(
            errorMessage,
            'bottom right',
            15000,
            'aceptar'
          );
          break;

        default:
          errorMessage = error.error.message.toString();
          _messageService.showError(
            errorMessage,
            'bottom right',
            15000,
            'aceptar'
          );
          break;
      }

      if (errStatus !== 404) {
        _dialog.closeAll();
      }

      return throwError(error);
    })
  );
};
