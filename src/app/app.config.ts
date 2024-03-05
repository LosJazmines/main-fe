import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    //withPreloading(PreloadAllModules)
    // Preloading improves UX by loading parts of your application in the background. You can preload modules, standalone components or component data.
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
};
