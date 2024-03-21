import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { graphqlProvider } from './@graphql/config/graphql.provider';
import { authInterceptor } from './@core/interceptors/auth-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    
    //withPreloading(PreloadAllModules)
    // Preloading improves UX by loading parts of your application in the background. You can preload modules, standalone components or component data.
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true, // If set to true, the connection is established within the Angular zone
    }),
    provideHttpClient(withInterceptors([
      authInterceptor
    ])),
    graphqlProvider,

    // provideStore(),
  ],
};
