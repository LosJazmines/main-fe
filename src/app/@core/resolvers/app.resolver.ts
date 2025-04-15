import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { SplashScreenService } from '@core/services/splash-screen.service';

@Injectable({
  providedIn: 'root'
})
export class AppResolver implements Resolve<any> {
  constructor(
    private splashScreenService: SplashScreenService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  resolve(): Observable<any> {
    this.splashScreenService.show();
    
    return of(true).pipe(
      delay(2000), // Tiempo mínimo de visualización
      finalize(() => {
        if (isPlatformBrowser(this.platformId)) {
          // Solo en el navegador
          setTimeout(() => {
            this.splashScreenService.hide();
          }, 500);
        } else {
          // En el servidor
          this.splashScreenService.hide();
        }
      })
    );
  }
} 