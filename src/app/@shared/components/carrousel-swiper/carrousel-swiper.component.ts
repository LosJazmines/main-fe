import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { CommonModule, isPlatformBrowser } from '@angular/common';
// register Swiper custom elements
register();

interface BannerImage {
  url: string;
  order: number;
}

@Component({
  selector: 'app-carrousel-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrousel-swiper.component.html',
  styleUrl: './carrousel-swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarrouselSwiperComponent implements OnInit {
  @Input() images: BannerImage[] = [];

  isBrowser: boolean;

  imgHeader: any[] = [
    {
      img_url: './../../../../assets/img/header/banner diario-980x460.jpg',
    },
    {
      img_url: './../../../../assets/img/header/Banner mayo.-980x460.jpg',
    },
    {
      img_url: './../../../../assets/img/header/banner mayo3-980x460.jpg',
    },
    {
      img_url: './../../../../assets/img/header/banner diario-980x460.jpg',
    },
    {
      img_url: './../../../../assets/img/header/Banner mayo.-980x460.jpg',
    },
    {
      img_url: './../../../../assets/img/header/banner mayo3-980x460.jpg',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void { }

}


