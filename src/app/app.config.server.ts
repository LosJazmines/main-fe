import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { httpOptionsService } from './@apis/httpOptions.service';
import { AuthService } from './@apis/auth.service';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), AuthService, httpOptionsService],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
