import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    // const _authStorage = inject(AuthStorageService);
  
    // const authService = inject(AuthService);

    const _router = inject(Router);



    const idToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NDdkNTdmLTZiNDUtNDNjZS1hODQwLWVjMTFmNTQzZDVlMSIsImlhdCI6MTcxMDk4NzQ2MCwiZXhwIjoxNzExMDczODYwfQ.hQkFR59U6sBcqc_mviugpciSkym2mfDkN-wkbJqjFZI'

    let newReq = req.clone();

    if (idToken) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', idToken),
        });
    }


    return next(newReq).pipe(
      catchError((error) =>
      {
          // Catch "401 Unauthorized" responses
          if ( error instanceof HttpErrorResponse && error.status === 401 )
          {
              // Sign out
            //   authService.signOut();
            //   _authStorage.singOut();
              _router.navigate(['/sign-in']);

              // Reload the app
              location.reload();
          }

          return throwError(error);
      }),
  );
};
