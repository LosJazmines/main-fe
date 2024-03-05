import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requestsCounter = 0;

  constructor(
    @Inject(LoadingService) private _loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.requestsCounter++;

    this._loadingService.show();
    return next.handle(request).pipe(
      finalize(() => {
        this.requestsCounter--;

        if (this.requestsCounter === 0) {
          this._loadingService.hide();
        }
      })
    );
  }
}
