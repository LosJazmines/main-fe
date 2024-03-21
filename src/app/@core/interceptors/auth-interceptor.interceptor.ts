import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const _authStorage = inject(AuthStorageService);

  // const authService = inject(AuthService);

  const _router = inject(Router);
  const isBrowser = inject(PLATFORM_ID) === 'browser';

  let idTokenlocalStorage: string | null = null;

  if (isBrowser) {
    idTokenlocalStorage = localStorage.getItem('session');
  }

  let newReq = req.clone();

  if (idTokenlocalStorage) {
    newReq = req.clone({
      headers: req.headers.set('Authorization', idTokenlocalStorage),
    });
  }

  return next(newReq).pipe(
    catchError((error) => {
      // Catch "401 Unauthorized" responses
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Sign out
        //   authService.signOut();
        //   _authStorage.singOut();
        // _router.navigate(['/sign-in']);

        // Reload the app
        location.reload();
      }

      return throwError(error);
    })
  );
};
