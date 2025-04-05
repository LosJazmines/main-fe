import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { AdminHeaderStore } from '@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { LucideModule } from '@shared/lucide/lucide.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from '@apis/products.service';
import { TokenService } from '@core/services/token.service';
import { MessageService } from '@core/services/snackbar.service';
import { Store } from '@ngrx/store';
import { AddProductComponent } from '../forms/add-product/add-product.component';
import { SearchModernoReactiveModule } from '../../core/components/search-moderno-reactive/search-moderno-reactive.module';
import { Animations } from '@shared/animations';
import { Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { EditGalleryComponent } from '../../core/components/edit-gallery/edit-gallery.component';
import { MatDialog } from '@angular/material/dialog';

// Interfaz extendida para los productos (adaptada a la tabla de inventario)
export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  type: string;
  price: number;
  stock: number;
  sold?: number;
  thumbnail?: string;
  active: boolean;
  // Propiedades opcionales para el formulario
  description?: string;
  maxPurchasePerUser?: number;
  cost?: number;
  basePrice?: number;
  taxPercent?: number;
  weight?: number;
  images?: any[];
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
    SearchModernoReactiveModule,
    CustomSelectComponent
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

  productsOne = signal<InventoryProduct[]>([]);
  products: InventoryProduct[] = [];
  filteredProducts = [...this.products];
  selectedCategory = '';
  minPrice = 0;
  maxPrice = 0;

  flashMessage: 'success' | 'error' | null = null;
  selectedProduct: InventoryProduct | null = null;
  selectedProductForm: FormGroup;

  filteredTags: any[] = [];
  tagsEditMode = false;
  categories: any[] = [];
  types: any[] = [];
  vendors: any[] = [];

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pagination = {
    length: 0,
    page: 0,
    size: 10
  };

  isLoading = false;
  isNewProduct = false;

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _productsService: ProductsService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {
    this.selectedProductForm = this._fb.group({
      name: [''],
      images: [[]],
      currentImageIndex: [0],
      active: [false],
      sku: [''],
      barcode: [''],
      category: [''],
      type: [''],
      vendor: [''],
      stock: [''],
      maxPurchasePerUser: [''],
      description: [''],
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
    this.loadSelectOptions();
  }

  get products$(): Observable<InventoryProduct[]> {
    return of(this.filteredProducts);
  }

  get categoriesOptions() {
    return this.categories.map(category => ({ id: category.id, text: category.name }));
  }

  get typesOptions() {
    return this.types.map(type => ({ id: type.id, text: type.name }));
  }

  get vendorsOptions() {
    return this.vendors.map(vendor => ({ id: vendor.id, text: vendor.name }));
  }

  loadSelectOptions(): void {
    this.categories = [
      { id: 'cat1', name: 'Flores' },
      { id: 'cat2', name: 'Plantas' },
      { id: 'cat3', name: 'Macetas' }
    ];

    this.types = [
      { id: 'brand1', name: 'Marca A' },
      { id: 'brand2', name: 'Marca B' },
      { id: 'brand3', name: 'Marca C' }
    ];

    this.vendors = [
      { id: 'vendor1', name: 'Proveedor X' },
      { id: 'vendor2', name: 'Proveedor Y' },
      { id: 'vendor3', name: 'Proveedor Z' }
    ];
  }

  calculateStatistics(): void {
    this.totalProducts = this.products.length;
    this.totalSold = this.products.reduce((sum, product) => sum + (product.sold || 0), 0);
    this.outOfStock = this.products.filter(product => product.stock === 0).length;
    this.lowStock = this.products.filter(product => product.stock > 0 && product.stock < 5).length;
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files: File[] = Array.from(input.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Aquí puedes actualizar un array para previews, por ejemplo:
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
        // Agrega el archivo al array de archivos seleccionados
        this.selectedFiles.push(file);
      });
      // Actualiza el form control para que contenga el array de archivos
      this.selectedProductForm.patchValue({ images: this.selectedFiles });
      console.log('Imágenes seleccionadas:', this.selectedProductForm.get('images')?.value);
    }
  }


  private getProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          sku: p.id.toString(),
          category: p.category,
          price: p.price,
          stock: p.stock,
          sold: p.sold,
          type: p.type,
          active: p.stock > 0,
          thumbnail: p.thumbnail || 'assets/default-thumbnail.png',
          description: p.description || '',
          maxPurchasePerUser: p.maxPurchasePerUser || 0,
          cost: p.cost || p.price * 0.8,
          basePrice: p.basePrice || p.price,
          taxPercent: p.taxPercent || 0,
          weight: p.weight || 0,
          images: p.images || [],
          tags: p.tags || []
        }));
        this.filteredProducts = [...this.products];
        this.productsOne.set(this.products);

        console.log('Productos obtenidos:', this.products);

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
    const dialogRef = this._dialog.open(AddProductComponent, {
      data: { name: 'hola', animal: 'hola' },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.success) {
        this.getProducts();
      }
      this._adminHeaderStore.updateHeaderTitle('Productos');
    });
  }

  openImageEditor(product: InventoryProduct): void {
    const dialogRef = this._dialog.open(EditGalleryComponent, {
      data: { product: product },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // Maneja el resultado del diálogo si es necesario
    });
  }

  toggleDetails(productId: string): void {
    if (this.selectedProduct && this.selectedProduct.id === productId) {
      this.selectedProduct = null;
    } else {
      const product = this.products.find(p => p.id === productId) || null;
      this.selectedProduct = product;
      if (product) {
        this.selectedProductForm.patchValue({
          name: product.name,
          images: product.images || [],
          currentImageIndex: 0,
          active: product.active,
          sku: product.sku,
          barcode: '',
          category: product.category,
          type: product.type,
          vendor: '',
          stock: product.stock,
          maxPurchasePerUser: product.maxPurchasePerUser || 0,
          description: product.description,
          cost: product.cost,
          basePrice: product.basePrice,
          taxPercent: product.taxPercent,
          price: product.price,
          weight: product.weight
        });
      }
    }
  }

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
  }

  // =============================================
  // Funcionalidad para crear un producto vacío inline
  // =============================================
  createEmptyProduct(): void {
    const emptyProduct: InventoryProduct = {
      id: '', // id vacío o temporal
      name: '',
      sku: '',
      category: '',
      type: '',
      price: 0,
      stock: 0,
      sold: 0,
      active: true,
      thumbnail: '',
      images: [],
      tags: []
    };

    this.isNewProduct = true;
    this.products.unshift(emptyProduct);
    this.filteredProducts = [...this.products];
    this.selectedProduct = emptyProduct;

    this.selectedProductForm.patchValue({
      name: '',
      images: [],
      currentImageIndex: 0,
      active: true,
      sku: '',
      barcode: '',
      category: '',
      type: '',
      vendor: '',
      stock: 0,
      maxPurchasePerUser: 0,
      description: '',
      cost: 0,
      basePrice: 0,
      taxPercent: 0,
      price: 0,
      weight: 0
    });
  }

  private buildFormData(data: any, formData: FormData = new FormData(), parentKey: string = ''): FormData {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        this.buildFormData(data[key], formData, parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
    return formData;
  }

  saveProduct(): void {
    // this.isLoading.set(true);

    if (this.selectedProductForm.invalid) {
      console.log('Formulario no válido', this.selectedProductForm.value);
      // this.isLoading.set(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.selectedProductForm.get('name')?.value);
    formData.append('category', this.selectedProductForm.get('category')?.value);
    formData.append('price', this.selectedProductForm.get('price')?.value);
    formData.append('stock', this.selectedProductForm.get('stock')?.value);
    formData.append('maxPurchasePerUser', this.selectedProductForm.get('maxPurchasePerUser')?.value);
    formData.append('description', this.selectedProductForm.get('description')?.value);
    formData.append('type', this.selectedProductForm.get('type')?.value);

    // Adjuntar las imágenes seleccionadas al FormData
    const images = this.selectedProductForm.get('images')?.value;
    console.log('Imágenes seleccionadas2:', images);

    images.forEach((file: File) => {
      formData.append('files', file);
    });

    this._productsService.createProduct(formData).subscribe({
      next: (response: any) => {
        console.log('Producto creado:', response);
        this._messageService.showInfo('Producto creado exitosamente', 'bottom right', 5000);
        // Reiniciar archivos e imágenes
        this.selectedFiles = [];
        // Reiniciar el formulario
        this.selectedProductForm.reset();
        this.selectedProductForm.markAsPristine();
        this.selectedProductForm.markAsUntouched();
        // this.isLoading.set(false);

        this.getProducts();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this._messageService.showError('Error al crear producto', 'bottom right', 5000);
        // this.isLoading.set(false);
      }
    });
  }


  cancelNewProduct(): void {
    if (this.isNewProduct && this.selectedProduct) {
      this.products = this.products.filter(p => p !== this.selectedProduct);
      this.filteredProducts = [...this.products];
      this.selectedProduct = null;
      this.isNewProduct = false;
      this.selectedProductForm.reset();
    }
  }

  updateSelectedProduct(): void {
    if (this.selectedProduct) {
      console.log('Actualizando producto:', this.selectedProduct);
      this.flashMessage = 'success';
      setTimeout(() => {
        this.flashMessage = null;
      }, 3000);
    }
  }

  deleteSelectedProduct(): void {
    if (this.selectedProduct) {
      console.log('Eliminando producto seleccionado:', this.selectedProduct);
      this.selectedProduct = null;
    }
  }
}
