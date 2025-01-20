import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CardItemComponent } from '../../../@shared/components/card-item/card-item.component';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { Animations } from '../../../@shared/animations';
import { CarrouselSwiperComponent } from '../../../@shared/components/carrousel-swiper/carrousel-swiper.component';
import { CircleFilterComponent } from '../../../@shared/components/circle-filter/circle-filter.component';
// register Swiper custom elements
register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardItemComponent,
    CarrouselSwiperComponent,
    CircleFilterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [Animations],
})
export default class HomeComponent implements OnInit {
  // Lista de posibles colecciones
  coleccionesTipos: string[] = [
    'Primavera',
    'Verano',
    'Otoño',
    'Invierno',
    'Colección Especial',
    'Novedades',
  ];

  filters = [
    { categoryName: 'Ramos', iconPath: 'ruta-del-icono/flores.png' },
    { categoryName: 'Novia', iconPath: 'ruta-del-icono/ramos.png' },
    { categoryName: 'Oso de Peluche', iconPath: 'ruta-del-icono/oso.png' },
    { categoryName: 'Combos', iconPath: 'ruta-del-icono/combos.png' },
    { categoryName: 'Cactus', iconPath: 'ruta-del-icono/cactus.png' },
    {
      categoryName: 'Regalos Especiales',
      iconPath: 'ruta-del-icono/regalos-especiales.png',
    },
  ];
  // Variable para almacenar la temporada actual
  temporada: string;

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.temporada = this.obtenerTemporada();
  }

  ngOnInit(): void {
    // Generar un título aleatorio
    this.temporada =
      this.coleccionesTipos[
        Math.floor(Math.random() * this.coleccionesTipos.length)
      ];
  }

  products = [
    {
      name: 'Oso de Peluche',
      description: 'Suave y adorable oso de peluche.',
      price: 29.99,
      image: './../../../../assets/img/casamientos/ramos-principales/02.jpg',
      category: 'osos',
      isNew: false,
    },
    {
      name: 'Arreglo de Tulipanes',
      description: 'Hermoso arreglo de tulipanes frescos.',
      price: 45.99,
      image: './../../../../assets/img/casamientos/Boutonniere/01.jpg',
      category: 'flores',
      isNew: false,
    },
    {
      name: 'Bouquet de Novia',
      description: 'Bouquet especial para bodas.',
      price: 89.99,
      image: './../../../../assets/img/casamientos/centros-mesa-novia/01.jpg',
      category: 'novia',
      isNew: true,
    },
    {
      name: 'Osito con Rosas',
      description: 'Un oso decorado con rosas artificiales.',
      price: 69.99,
      image: './../../../../assets/img/casamientos/ramos-de-novias/01.jpg',
      category: 'osos',
      isNew: true,
    },
    // Más productos
  ];

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

  // Categoría seleccionada para el filtro
  selectedCategory: string = '';

  // Método para filtrar productos
  get filteredProducts() {
    if (!this.selectedCategory) {
      return this.products; // Mostrar todos los productos si no hay filtro
    }
    return this.products.filter(
      (product) => product.category === this.selectedCategory
    );
  }

  // Método para seleccionar una categoría
  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  onCategorySelected(selectedCategory: any): void {
    console.log('Categoría seleccionada:', selectedCategory);
  }
  obtenerTemporada(): string {
    const mes = new Date().getMonth(); // Obtiene el mes actual (0-11)

    // Mapea el mes actual a la temporada
    if (mes >= 2 && mes <= 4) {
      return 'Primavera';
    } else if (mes >= 5 && mes <= 7) {
      return 'Verano';
    } else if (mes >= 8 && mes <= 10) {
      return 'Otoño';
    } else {
      return 'Invierno';
    }
  }
}
