import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../@apis/products.service';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { Store } from '@ngrx/store';
import { ProductsTableComponent } from '../../core/components/products-table/products-table.component';
import { Dialog } from '@angular/cdk/dialog';
import { AddProductComponent } from '../forms/add-product/add-product.component';
import { SearchModernoReactiveModule } from '../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { Animations } from '@shared/animations';
import { Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

// Interfaz extendida para los productos (adaptada a la tabla de inventario)
export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  sold?: number;
  thumbnail?: string;
  active: boolean;
  // Propiedades opcionales para el formulario
  description?: string;
  reserved?: number;
  cost?: number;
  basePrice?: number;
  taxPercent?: number;
  weight?: number;
  images?: string[];
  tags?: string[];
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SearchModernoReactiveModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [Animations],
})
export default class ProductsComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  totalProducts = 0;
  totalSold = 0;
  outOfStock = 0;
  lowStock = 0;

  // Signal para manejar los productos de forma reactiva
  productsOne = signal<InventoryProduct[]>([]);

  // Lista local de productos; se puede inicializar con datos por defecto
  products: InventoryProduct[] = [
    {
      id: '101',
      name: 'Rosa Roja',
      category: 'Flores',
      sku: '101',
      price: 25,
      stock: 15,
      sold: 30,
      active: true,
      thumbnail: 'assets/images/rosa-roja.png',
      images: [],
      tags: []
    },
    {
      id: '102',
      name: 'Cactus Mini',
      category: 'Plantas',
      sku: '102',
      price: 15,
      stock: 2,
      sold: 20,
      active: true,
      thumbnail: 'assets/images/cactus-mini.png',
      images: [],
      tags: []
    },
    {
      id: '103',
      name: 'Maceta de Cerámica',
      category: 'Macetas',
      sku: '103',
      price: 50,
      stock: 0,
      sold: 15,
      active: false,
      thumbnail: 'assets/images/maceta.png',
      images: [],
      tags: []
    },
    {
      id: '104',
      name: 'Fertilizante Líquido',
      category: 'Fertilizantes',
      sku: '104',
      price: 10,
      stock: 7,
      sold: 50,
      active: true,
      thumbnail: 'assets/images/fertilizante.png',
      images: [],
      tags: []
    },
  ];

  filteredProducts = [...this.products];
  selectedCategory = '';
  minPrice = 0;
  maxPrice = 0;

  // Propiedad para mensajes flash en el formulario
  flashMessage: 'success' | 'error' | null = null;

  // Producto seleccionado para mostrar detalles / editar
  selectedProduct: InventoryProduct | null = null;

  // Formulario para el producto seleccionado (detalle/edición)
  selectedProductForm: FormGroup;

  // Propiedades para tags (dummy)
  filteredTags: any[] = [];
  tagsEditMode: boolean = false;

  // Arrays dummy para selects
  categories: any[] = [];
  brands: any[] = [];
  vendors: any[] = [];

  // Paginación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pagination = {
    length: 0,  // total de productos (a actualizar)
    page: 0,
    size: 10
  };

  // Flag para mostrar loader
  isLoading: boolean = false;

  // Bandera para identificar si se está creando un nuevo producto
  isNewProduct: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _dialog: Dialog,
    private _productsService: ProductsService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {
    // Inicializamos el formulario del producto seleccionado
    this.selectedProductForm = this._fb.group({
      name: [''],
      images: [[]],
      currentImageIndex: [0],
      active: [false],
      sku: [''],
      barcode: [''],
      category: [''],
      brand: [''],
      vendor: [''],
      stock: [''],
      reserved: [''],
      cost: [''],
      basePrice: [''],
      taxPercent: [''],
      price: [''],
      weight: ['']
    });
  }

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Productos');
    this.calculateStatistics();
    this.getProducts();
  }

  // Getter para exponer un observable de productos para el template
  get products$(): Observable<InventoryProduct[]> {
    return of(this.filteredProducts);
  }

  calculateStatistics(): void {
    this.totalProducts = this.products.length;
    this.totalSold = this.products.reduce((sum, product) => sum + (product.sold || 0), 0);
    this.outOfStock = this.products.filter(product => product.stock === 0).length;
    this.lowStock = this.products.filter(product => product.stock > 0 && product.stock < 5).length;
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      const matchesMinPrice = this.minPrice ? product.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice ? product.price <= this.maxPrice : true;
      return matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  private getProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (response: any) => {
        // Mapea la respuesta a la interfaz InventoryProduct y asigna valores por defecto
        this.products = response.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          sku: p.id.toString(), // o utiliza p.sku si está disponible
          category: p.category,
          price: p.price,
          stock: p.stock,
          sold: p.sold,
          active: p.stock > 0,
          thumbnail: p.thumbnail || 'assets/default-thumbnail.png',
          description: p.description || '',
          reserved: p.reserved || 0,
          cost: p.cost || p.price * 0.8,
          basePrice: p.basePrice || p.price,
          taxPercent: p.taxPercent || 0,
          weight: p.weight || 0,
          images: p.images || [],
          tags: p.tags || []
        }));
        this.filteredProducts = [...this.products];
        this.productsOne.set(this.products);
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  editProduct(product: InventoryProduct): void {
    console.log('Editando producto:', product);
  }

  deleteProduct(product: InventoryProduct): void {
    this.products = this.products.filter(p => p.id !== product.id);
    this.applyFilters();
    this.calculateStatistics();

    this._productsService.deleteProduct(product.id).subscribe({
      next: (response: any) => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.productsOne.set(this.products);
        this._messageService.showInfo('Producto eliminado correctamente', 'top right', 5000);
      },
      complete: () => {
        console.log('Request completed');
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      },
    });
  }

  handleSearch(event: string): void {
    const searchTerm = event.trim().toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  openDialogAddProduct(): void {
    const dialogRef = this._dialog.open<string>(AddProductComponent, {
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result: any) => {
      if (result?.success) {
        this.getProducts();
      }
      this._adminHeaderStore.updateHeaderTitle('Productos');
    });
  }

  // Método para alternar la visualización de detalles del producto y llenar el formulario
  toggleDetails(productId: string): void {
    if (this.selectedProduct && this.selectedProduct.id === productId) {
      this.selectedProduct = null;
    } else {
      const product = this.products.find(p => p.id === productId) || null;
      this.selectedProduct = product;
      // Si se selecciona un producto existente, llenamos el formulario
      if (product) {
        this.selectedProductForm.patchValue({
          name: product.name,
          images: product.images || [],
          currentImageIndex: 0,
          active: product.active,
          sku: product.sku,
          barcode: '',
          category: product.category,
          brand: '',
          vendor: '',
          stock: product.stock,
          reserved: product.reserved || 0,
          cost: product.cost,
          basePrice: product.basePrice,
          taxPercent: product.taxPercent,
          price: product.price,
          weight: product.weight
        });
      }
    }
  }

  // Método para cambiar de imagen (simulado)
  cycleImages(forward: boolean = true): void {
    const images = this.selectedProductForm.get('images')?.value;
    if (images && images.length > 0) {
      const currentIndex = this.selectedProductForm.get('currentImageIndex')?.value;
      let newIndex = forward ? currentIndex + 1 : currentIndex - 1;
      if (newIndex >= images.length) {
        newIndex = 0;
      }
      if (newIndex < 0) {
        newIndex = images.length - 1;
      }
      this.selectedProductForm.get('currentImageIndex')?.setValue(newIndex);
    }
  }

  // Métodos para tags (simulados)
  createTag(tag: string): void {
    console.log('Creando tag:', tag);
  }

  toggleTagsEditMode(): void {
    this.tagsEditMode = !this.tagsEditMode;
  }

  updateTagTitle(tag: any, event: any): void {
    console.log('Actualizando tag:', tag, event);
  }

  deleteTag(tag: any): void {
    console.log('Eliminando tag:', tag);
  }

  toggleProductTag(tag: any, event: any): void {
    console.log('Alternando tag en producto:', tag, event);
  }

  shouldShowCreateTagButton(inputValue: string): boolean {
    return !!inputValue;
  }

  // trackBy para optimizar el ngFor
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  filterTagsInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = (event.target as HTMLInputElement).value.trim();
      if (input) {
        this.createTag(input);
        (event.target as HTMLInputElement).value = '';
      }
    }
  }

  onFilterTags(event: Event): void {
    // Ejemplo de filtrado de tags
    // const input = (event.target as HTMLInputElement).value;
    // this.filteredTags = this.tags.filter(tag =>
    //   tag.title.toLowerCase().includes(input.toLowerCase())
    // );
  }

  // =============================================
  // Funcionalidad para crear un producto vacío inline
  // =============================================

  createEmptyProduct(): void {
    // Crear un producto vacío con valores por defecto
    const emptyProduct: InventoryProduct = {
      id: '', // id vacío o con un identificador temporal, por ejemplo 'new'
      name: '',
      sku: '',
      category: '',
      price: 0,
      stock: 0,
      sold: 0,
      active: true,
      thumbnail: '',
      images: [],
      tags: []
    };

    // Marcar que se está creando un nuevo producto
    this.isNewProduct = true;

    // Insertar el producto vacío en la lista
    this.products.unshift(emptyProduct);
    this.filteredProducts = [...this.products];

    // Seleccionar el producto para mostrar el formulario
    this.selectedProduct = emptyProduct;

    // Inicializar el formulario con valores por defecto
    this.selectedProductForm.patchValue({
      name: '',
      images: [],
      currentImageIndex: 0,
      active: true,
      sku: '',
      barcode: '',
      category: '',
      brand: '',
      vendor: '',
      stock: 0,
      reserved: 0,
      cost: 0,
      basePrice: 0,
      taxPercent: 0,
      price: 0,
      weight: 0
    });
  }

  saveProduct(): void {
    if (this.selectedProductForm.valid && this.selectedProduct) {
      const productData = this.selectedProductForm.value;

      if (this.isNewProduct) {
        // Llamada al servicio para crear el producto en el backend
        this._productsService.createProduct(productData).subscribe(
          (savedProduct: any) => {
            // Actualiza el producto en la lista con los datos retornados, por ejemplo, asignando el id generado
            const index = this.products.findIndex(p => p === this.selectedProduct);
            if (index > -1) {
              this.products[index] = {
                ...savedProduct,
                thumbnail: savedProduct.thumbnail || 'assets/default-thumbnail.png'
              };
            }
            this.selectedProduct = this.products[index];
            this.isNewProduct = false;
            this.flashMessage = 'success';
            setTimeout(() => { this.flashMessage = null; }, 3000);
          },
          error => {
            console.error('Error al guardar el producto:', error);
            this.flashMessage = 'error';
            setTimeout(() => { this.flashMessage = null; }, 3000);
          }
        );
      } else {
        // Actualización de un producto existente
        // this._productsService.updateProduct(productData).subscribe(
        //   (updatedProduct: any) => {
        //     const index = this.products.findIndex(p => p.id === updatedProduct.id);
        //     if (index > -1) {
        //       this.products[index] = updatedProduct;
        //     }
        //     this.selectedProduct = updatedProduct;
        //     this.flashMessage = 'success';
        //     setTimeout(() => { this.flashMessage = null; }, 3000);
        //   },
        //   error => {
        //     console.error('Error al actualizar el producto:', error);
        //     this.flashMessage = 'error';
        //     setTimeout(() => { this.flashMessage = null; }, 3000);
        //   }
        // );
      }
    }
  }

  cancelNewProduct(): void {
    if (this.isNewProduct && this.selectedProduct) {
      // Eliminar el producto vacío de la lista
      this.products = this.products.filter(p => p !== this.selectedProduct);
      this.filteredProducts = [...this.products];
      this.selectedProduct = null;
      this.isNewProduct = false;
      // Resetear el formulario
      this.selectedProductForm.reset();
    }
  }

  // Método para actualizar el producto seleccionado (simulación)
  updateSelectedProduct(): void {
    if (this.selectedProduct) {
      console.log('Actualizando producto:', this.selectedProduct);
      this.flashMessage = 'success';
      setTimeout(() => {
        this.flashMessage = null;
      }, 3000);
    }
  }

  // Método para eliminar el producto seleccionado (simulación)
  deleteSelectedProduct(): void {
    if (this.selectedProduct) {
      console.log('Eliminando producto seleccionado:', this.selectedProduct);
      // Aquí podrías llamar a un servicio para eliminarlo
      this.selectedProduct = null;
    }
  }
}
