import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

@Component({
  selector: 'app-online-store',
  standalone: true,
  imports: [],
  templateUrl: './online-store.component.html',
  styleUrl: './online-store.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class OnlineStoreComponent {
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
