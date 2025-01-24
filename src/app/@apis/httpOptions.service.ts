import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class httpOptionsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getHttpOptions() {
    let user: any;
    if (isPlatformBrowser(this.platformId)) {
      user = localStorage.getItem('user');
      
      if (user) {
        user = JSON.parse(user);
      }
    }

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: user?.token ? user?.token : '',
      }),
    };

    return httpOptions;
  }

  getToken() {
    let token;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('user');
    }
    return token;
  }
}
