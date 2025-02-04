import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './@core/interceptors/auth-interceptor.interceptor';
import { provideStore } from '@ngrx/store';
import { reducers } from './@shared/store/reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    //withPreloading(PreloadAllModules)
    // Preloading improves UX by loading parts of your application in the background. You can preload modules, standalone components or component data.
    provideStore(reducers), // Mover esto arriba
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false, // Desactiva `logOnly` para verificar
      autoPause: true,
      connectInZone: true,
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
  ],
};
