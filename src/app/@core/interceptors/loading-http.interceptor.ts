import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

let requestsCounter = 0;

export const loadingHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const _loadingService = inject(LoadingService);

    requestsCounter++;

    _loadingService.show();

    return next(req).pipe(
        finalize(() => {
            requestsCounter--;

            if (requestsCounter === 0) {
                _loadingService.hide();
            }
        })
    );
};
