import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { CardItemComponent } from '../../../@shared/components/card-item/card-item.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Animations } from '../../../@shared/animations';
import { ShopFiltersComponent } from '../../../@shared/components/shop-filters/shop-filters.component';
import { BreadcrumbComponent } from '../../../@shared/components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { CarrouselSwiperComponent } from '../../../@shared/components/carrousel-swiper/carrousel-swiper.component';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';
import { CarrouselSwiperStoreComponent } from '@shared/components/carrousel-swiper-store/carrousel-swiper-store.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toggleLeftSidebarFilters } from '@shared/components/sidebars/left-sidebar-filters/store/actions/left-sidebar-filters.actions';
// register Swiper custom elements
register();

@Component({
  selector: 'app-online-store',
  standalone: true,
  imports: [
    CommonModule,
    CardItemComponent,
    ShopFiltersComponent,
    BreadcrumbComponent,
    CarrouselSwiperStoreComponent,
    FormsModule,
    LucideModule,
    MaterialModule,
  ],
  templateUrl: './online-store.component.html',
  styleUrl: './online-store.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [Animations],
})
export default class OnlineStoreComponent implements OnInit {
  // Lista de posibles colecciones
  coleccionesTipos: string[] = [
    'Primavera',
    'Verano',
    'Otoño',
    'Invierno',
    'Colección Especial',
    'Novedades',
  ];
  // Variable para almacenar la temporada actual
  temporada: string;

  isBrowser: boolean;

  selectedOrder: string = 'ascendente';
  selectedOrderText: string = 'Ascendente';
  dropdownOpen = false;

  orderOptions = [
    { value: 'ascendente', text: 'Ascendente' },
    { value: 'descendente', text: 'Descendente' },
    { value: 'mayorValor', text: 'Mayor Valor' },
    { value: 'menorValor', text: 'Menor Valor' }
  ];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOrder(option: any) {
    this.selectedOrder = option.value;
    this.selectedOrderText = option.text;
    this.dropdownOpen = false;
    this.applyFilter();

    // Actualizar la URL con el parámetro 'order'
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { order: this.selectedOrder },
      queryParamsHandling: 'merge'
    });
  }


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.temporada = this.obtenerTemporada();
  }

  openLeftDrawer() {
    this.store.dispatch(toggleLeftSidebarFilters({ isOpen: true }));
  }

  // Datos de ejemplo
  items = [
    {
      name: 'Ramo de rosas',
      description: 'Hermoso ramo de rosas rojas',
      price: 300,
    },
    {
      name: 'Flor de lis',
      description: 'Ramo de flores frescas de lis',
      price: 150,
    },
    {
      name: 'Ramo de girasoles',
      description: 'Ramo de girasoles de campo',
      price: 200,
    },
    {
      name: 'Tulipanes',
      description: 'Ramo de tulipanes coloridos',
      price: 250,
    },
  ];

  // selectedOrder: string = 'ascendente'; // Valor por defecto
  filteredItems = [...this.items]; // Items filtrados según el orden seleccionado

  // Método para aplicar el filtro de orden
  applyFilter() {
    if (this.selectedOrder === 'ascendente') {
      this.filteredItems = [...this.items].sort((a, b) => a.price - b.price);
    } else if (this.selectedOrder === 'descendente') {
      this.filteredItems = [...this.items].sort((a, b) => b.price - a.price);
    } else if (this.selectedOrder === 'mayorValor') {
      this.filteredItems = [...this.items].sort((a, b) => b.price - a.price);
    } else if (this.selectedOrder === 'menorValor') {
      this.filteredItems = [...this.items].sort((a, b) => a.price - b.price);
    }
  }

  ngOnInit(): void {
    // Configurar estado inicial del orden si está presente en los query params
    this.route.queryParams.subscribe(params => {
      if (params['order']) {
        this.selectedOrder = params['order'];
        const foundOption = this.orderOptions.find(option => option.value === params['order']);
        if (foundOption) {
          this.selectedOrderText = foundOption.text;
        }
        this.applyFilter(); // Reordena los productos según el orden obtenido
      }
    });

    // Otras inicializaciones, por ejemplo, para la temporada
    this.temporada =
      this.coleccionesTipos[
      Math.floor(Math.random() * this.coleccionesTipos.length)
      ];
  }

  openLeftFiltersDrawer() {
    this.store.dispatch(toggleLeftSidebarFilters({ isOpen: true }));
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
