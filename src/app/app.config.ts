import { ApplicationConfig, isDevMode, importProvidersFrom } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './@core/interceptors/auth-interceptor.interceptor';
import { provideStore } from '@ngrx/store';
import { reducers } from './@shared/store';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { LucideModule } from './@shared/lucide/lucide.module';
import { provideToastr } from 'ngx-toastr';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';

const config: SocketIoConfig = {
  url: `${environment.api}/notifications`,
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: false,
    timeout: 5000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    path: '/socket.io'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      connectInZone: true,
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideToastr(),
    SocialLoginModule,
    LucideModule,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '262282692430-cg56q67dgppq13q98jncjlt62hv0p89o.apps.googleusercontent.com',
              {
                oneTapEnabled: false,
                prompt: 'select_account'
              }
            ),
          },
        ],
        onError: (err) => {
          console.error('Google Sign-In error:', err);
        },
      } as SocialAuthServiceConfig,
    },
    importProvidersFrom(
      SocketIoModule.forRoot(config)
    )
  ],
};
