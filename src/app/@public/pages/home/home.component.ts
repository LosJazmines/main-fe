import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { CardItemComponent } from '../../../@shared/components/card-item/card-item.component';

// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { Animations } from '../../../@shared/animations';
import { CarrouselSwiperComponent } from '../../../@shared/components/carrousel-swiper/carrousel-swiper.component';
import { CircleFilterComponent } from '../../../@shared/components/circle-filter/circle-filter.component';
import { ProductsService } from '../../../@apis/products.service';
import { LucideModule } from '@shared/lucide/lucide.module';
import { filter_home } from '@apis/data/filter';
import { RouterModule } from '@angular/router';
import { PublicStoreConfigService } from '../../core/services/store-config.service';

// register Swiper custom elements
register();
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardItemComponent,
    LucideModule,
    RouterModule,
    CarrouselSwiperComponent,
    CircleFilterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [Animations],
})
export default class HomeComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;


  // Lista de posibles colecciones
  coleccionesTipos: string[] = [
    'Primavera',
    'Verano',
    'Otoño',
    'Invierno',
    'Novedades',
  ];
  utlImgs = '../../../../assets/img/categorias/';

  // Filtros cargados desde el archivo JSON
  filters: Array<{ categoryName: string; iconPath: string }> = filter_home;
  // Variable para almacenar la temporada actual
  temporada: string;

  isBrowser: boolean;

  imgHeader: { url: string; order: number }[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private _productsService: ProductsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private storeConfigService: PublicStoreConfigService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.temporada = this.obtenerTemporada();
  }

  ngOnInit(): void {
    // Generar un título aleatorio
    this.temporada =
      this.coleccionesTipos[
      Math.floor(Math.random() * this.coleccionesTipos.length)
      ];

    this.getProductsFindActive();
    this.loadBanners();
  }

  ngAfterViewInit() {
    this.updateShadows();
  }


  updateShadows(): void {
    if (!this.isBrowser) return;

    const scrollEl = this.scrollContainer.nativeElement;
    const leftShadow = this.document.getElementById('leftShadow');
    const rightShadow = this.document.getElementById('rightShadow');

    if (!leftShadow || !rightShadow) return;

    leftShadow.classList.toggle('hidden', scrollEl.scrollLeft <= 0);
    rightShadow.classList.toggle('hidden', scrollEl.scrollLeft + scrollEl.clientWidth >= scrollEl.scrollWidth);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.updateShadows();
  }


  // Categoría seleccionada para el filtro
  selectedCategory: string = '';
  products = signal<any[]>([]);

  // Método para filtrar productos
  // get filteredProducts() {
  //   if (!this.selectedCategory) {
  //     return this.products; // Mostrar todos los productos si no hay filtro
  //   }
  //   return this.products.filter(
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

  loadBanners(): void {
    this.loading = true;
    this.error = null;

    this.storeConfigService.getHomeBanners().subscribe({
      next: (banners) => {
        this.imgHeader = banners.sort((a, b) => a.order - b.order);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading banners';
        this.loading = false;
        console.error('Error loading banners:', error);
      }
    });
  }
}
