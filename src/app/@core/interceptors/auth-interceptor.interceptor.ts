import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenService);

  // Skip token for public endpoints
  if (isPublicEndpoint(req.url)) {
    return next(req);
  }

  // Get token safely
  const token = tokenService.getToken();
  if (!token) {
    return next(req);
  }

  // Clone request and add token
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        tokenService.removeToken();
      }
      return throwError(() => error);
    })
  );
};

function isPublicEndpoint(url: string): boolean {
  const publicEndpoints = [
    '/api/public/store/categories',
    '/api/public/store/tags',
    '/api/public/store/categories/:uuid/tags',
    '/api/public/store/config',
    '/auth/login',
    '/auth/register'
  ];
  return publicEndpoints.some(endpoint => {
    const pattern = endpoint.replace(':uuid', '[^/]+');
    return new RegExp(pattern).test(url);
  });
}
