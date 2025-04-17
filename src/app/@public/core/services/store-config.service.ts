import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

interface BannerImage {
  url: string;
  order: number;
}

interface StoreConfig {
  homeBannerImages: BannerImage[];
  storeBannerImages: BannerImage[];
}

@Injectable({
  providedIn: 'root'
})
export class PublicStoreConfigService {
  private apiUrl = `${environment.api}/store-config`;

  constructor(private http: HttpClient) {}

  getHomeBanners(): Observable<BannerImage[]> {
    return this.http.get<StoreConfig>(`${this.apiUrl}`).pipe(
      map(config => config.homeBannerImages || [])
    );
  }

  getStoreBanners(): Observable<BannerImage[]> {
    return this.http.get<StoreConfig>(`${this.apiUrl}`).pipe(
      map(config => config.storeBannerImages || [])
    );
  }
} 