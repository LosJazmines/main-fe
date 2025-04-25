import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
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
import { ProductsService, ProductFilters } from '@apis/products.service';
import { PublicStoreConfigService } from '../../../@public/core/services/store-config.service';
import { BannerImage } from '@core/types/store-config';
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
  products = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  error: string | null = null;
  imgHeader: BannerImage[] = [];

  orderOptions = [
    { value: 'ascendente', text: 'Ascendente' },
    { value: 'descendente', text: 'Descendente' },
    { value: 'mayorValor', text: 'Mayor Valor' },
    { value: 'menorValor', text: 'Menor Valor' }
  ];

  currentFilters: ProductFilters = {};
  priceRange = {
    min: '',
    max: ''
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private store: Store,
    private route: ActivatedRoute,
    private _productsService: ProductsService,
    @Inject(PublicStoreConfigService) private storeConfigService: PublicStoreConfigService,
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
    // Subscribe to URL query parameter changes
    this.route.queryParams.subscribe(params => {
      // Parse price values to numbers
      const minPrice = params['minPrice'] ? Number(params['minPrice']) : undefined;
      const maxPrice = params['maxPrice'] ? Number(params['maxPrice']) : undefined;

      // Update price range inputs
      this.priceRange = {
        min: minPrice?.toString() || '',
        max: maxPrice?.toString() || ''
      };

      this.currentFilters = {
        category: params['category'],
        tag: params['tag'],
        minPrice: minPrice,
        maxPrice: maxPrice,
        order: params['order']
      };

      // Update selected order if present in URL
      if (params['order']) {
        this.selectedOrder = params['order'];
        const foundOption = this.orderOptions.find(option => option.value === params['order']);
        if (foundOption) {
          this.selectedOrderText = foundOption.text;
        }
      }

      this.loadProducts(this.currentFilters);
    });

    this.loadBanners();
  }

  loadBanners(): void {
    this.isLoading.set(true);
    this.error = null;

    this.storeConfigService.getStoreBanners().subscribe({
      next: (banners: BannerImage[]) => {
        console.log(banners);
        
        this.imgHeader = banners.sort((a: BannerImage, b: BannerImage) => a.order - b.order);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.error = 'Error loading banners';
        this.isLoading.set(false);
        console.error('Error loading banners:', error);
      }
    });
  }

  openLeftFiltersDrawer() {
    this.store.dispatch(toggleLeftSidebarFilters({ isOpen: true }));
  }

  // products = [
  //   {
  //     name: 'Oso de Peluche',
  //     description: 'Suave y adorable oso de peluche.',
  //     price: 29.99,
  //     image: './../../../../assets/img/casamientos/ramos-principales/02.jpg',
  //     category: 'osos',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Arreglo de Tulipanes',
  //     description: 'Hermoso arreglo de tulipanes frescos.',
  //     price: 45.99,
  //     image: './../../../../assets/img/casamientos/Boutonniere/01.jpg',
  //     category: 'flores',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Bouquet de Novia',
  //     description: 'Bouquet especial para bodas.',
  //     price: 89.99,
  //     image: './../../../../assets/img/casamientos/centros-mesa-novia/01.jpg',
  //     category: 'novia',
  //     isNew: true,
  //   },
  //   {
  //     name: 'Osito con Rosas',
  //     description: 'Un oso decorado con rosas artificiales.',
  //     price: 69.99,
  //     image: './../../../../assets/img/casamientos/ramos-de-novias/01.jpg',
  //     category: 'osos',
  //     isNew: true,
  //   },
  //   {
  //     name: 'Oso de Peluche',
  //     description: 'Suave y adorable oso de peluche.',
  //     price: 29.99,
  //     image: './../../../../assets/img/casamientos/ramos-principales/02.jpg',
  //     category: 'osos',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Arreglo de Tulipanes',
  //     description: 'Hermoso arreglo de tulipanes frescos.',
  //     price: 45.99,
  //     image: './../../../../assets/img/casamientos/Boutonniere/01.jpg',
  //     category: 'flores',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Bouquet de Novia',
  //     description: 'Bouquet especial para bodas.',
  //     price: 89.99,
  //     image: './../../../../assets/img/casamientos/centros-mesa-novia/01.jpg',
  //     category: 'novia',
  //     isNew: true,
  //   },
  //   {
  //     name: 'Osito con Rosas',
  //     description: 'Un oso decorado con rosas artificiales.',
  //     price: 69.99,
  //     image: './../../../../assets/img/casamientos/ramos-de-novias/01.jpg',
  //     category: 'osos',
  //     isNew: true,
  //   },
  //   {
  //     name: 'Oso de Peluche',
  //     description: 'Suave y adorable oso de peluche.',
  //     price: 29.99,
  //     image: './../../../../assets/img/casamientos/ramos-principales/02.jpg',
  //     category: 'osos',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Arreglo de Tulipanes',
  //     description: 'Hermoso arreglo de tulipanes frescos.',
  //     price: 45.99,
  //     image: './../../../../assets/img/casamientos/Boutonniere/01.jpg',
  //     category: 'flores',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Bouquet de Novia',
  //     description: 'Bouquet especial para bodas.',
  //     price: 89.99,
  //     image: './../../../../assets/img/casamientos/centros-mesa-novia/01.jpg',
  //     category: 'novia',
  //     isNew: true,
  //   },
  //   {
  //     name: 'Osito con Rosas',
  //     description: 'Un oso decorado con rosas artificiales.',
  //     price: 69.99,
  //     image: './../../../../assets/img/casamientos/ramos-de-novias/01.jpg',
  //     category: 'osos',
  //     isNew: true,
  //   },
  //   {
  //     name: 'Oso de Peluche',
  //     description: 'Suave y adorable oso de peluche.',
  //     price: 29.99,
  //     image: './../../../../assets/img/casamientos/ramos-principales/02.jpg',
  //     category: 'osos',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Arreglo de Tulipanes',
  //     description: 'Hermoso arreglo de tulipanes frescos.',
  //     price: 45.99,
  //     image: './../../../../assets/img/casamientos/Boutonniere/01.jpg',
  //     category: 'flores',
  //     isNew: false,
  //   },
  //   {
  //     name: 'Bouquet de Novia',
  //     description: 'Bouquet especial para bodas.',
  //     price: 89.99,
  //     image: './../../../../assets/img/casamientos/centros-mesa-novia/01.jpg',
  //     category: 'novia',
  //     isNew: true,
  //   },
  //   // Más productos
  // ];

  // Categoría seleccionada para el filtro
  selectedCategory: string = '';

  // Método para filtrar productos
  // get filteredProducts() {
  //   if (!this.selectedCategory) {
  //     return this.products(); // Mostrar todos los productos si no hay filtro
  //   }
  //   return this.products().filter(
  //     (product) => product.category === this.selectedCategory
  //   );
  // }

  private getProductsFindActive(): void {
    this._productsService.getProductsFindActive().subscribe({
      next: (response: any) => {
        // Process the response here
        // const products = [...response];
        this.products.set([...response]);

        // If you need to handle the response, you can do so here
        // For example:
        // this.products = response.products;
      },
      error: (error) => {
        // In case of error, handle it here
        console.error('Error fetching products:', error);
      },
    });
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

  private loadProducts(filters?: ProductFilters): void {
    this.isLoading.set(true);

    this._productsService.getProductsFindActive(filters).subscribe({
      next: (response: any) => {
        let products = [...response];
        
        // Apply client-side ordering if needed
        if (filters?.order) {
          products = this.orderProducts(products, filters.order);
        }

        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading.set(false);
      },
    });
  }

  private orderProducts(products: any[], order: string): any[] {
    switch (order) {
      case 'ascendente':
        return [...products].sort((a, b) => a.price - b.price);
      case 'descendente':
        return [...products].sort((a, b) => b.price - a.price);
      case 'mayorValor':
        return [...products].sort((a, b) => b.price - a.price);
      case 'menorValor':
        return [...products].sort((a, b) => a.price - b.price);
      default:
        return products;
    }
  }

  onFiltersChanged(event: any) {
    // Parse price values to numbers
    const minPrice = this.priceRange.min ? Number(this.priceRange.min) : undefined;
    const maxPrice = this.priceRange.max ? Number(this.priceRange.max) : undefined;

    // Merge new filters with existing ones, including order
    const newFilters: ProductFilters = {
      ...this.currentFilters,
      category: event.category,
      tag: event.tag,
      minPrice: minPrice,
      maxPrice: maxPrice
    };

    // Update URL with new filters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: event.category,
        tag: event.tag,
        minPrice: minPrice,
        maxPrice: maxPrice
      },
      queryParamsHandling: 'merge'
    });

    // Update current filters and load products
    this.currentFilters = newFilters;
    this.loadProducts(newFilters);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOrder(option: { value: string; text: string }) {
    this.selectedOrder = option.value;
    this.selectedOrderText = option.text;
    this.dropdownOpen = false;

    // Update filters with new order and reload products
    this.currentFilters = {
      ...this.currentFilters,
      order: option.value as 'ascendente' | 'descendente' | 'mayorValor' | 'menorValor'
    };

    // Update URL and reload products
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { order: option.value },
      queryParamsHandling: 'merge'
    });

    this.loadProducts(this.currentFilters);
  }
}
