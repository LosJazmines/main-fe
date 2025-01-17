import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { CardItemComponent } from '../../../@shared/components/card-item/card-item.component';
import { CommonModule } from '@angular/common';
// register Swiper custom elements
register();
@Component({
  selector: 'app-carrousel-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrousel-swiper.component.html',
  styleUrl: './carrousel-swiper.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarrouselSwiperComponent {
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
}
