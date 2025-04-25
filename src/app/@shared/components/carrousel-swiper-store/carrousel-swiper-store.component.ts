import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { CommonModule, isPlatformBrowser } from '@angular/common';
// register Swiper custom elements
register();

@Component({
  selector: 'app-carrousel-swiper-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrousel-swiper-store.component.html',
  styleUrl: './carrousel-swiper-store.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarrouselSwiperStoreComponent implements OnInit, AfterViewInit {
  @Input() images: any[] = [];

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.images?.length > 0) {
      console.log('Carousel images:', this.images);
    }
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after view is initialized
    if (this.isBrowser) {
      const swiperEl: any = document.querySelector('swiper-container');
      if (swiperEl) {
        Object.assign(swiperEl, {
          initialSlide: 0,
        });
        swiperEl.initialize();
      }
    }
  }
}


