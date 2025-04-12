import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const _router = inject(Router);
    const _tokenService = inject(TokenService);

    let newReq = req.clone();
    const token = _tokenService.getToken();

    if (token) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
    }

    return next(newReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                _tokenService.removeToken();
                _router.navigate(['/login']);
                location.reload();
            }
            return throwError(() => error);
        }),
    );
};
