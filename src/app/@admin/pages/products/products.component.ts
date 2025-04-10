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
import { IProduct } from '@core/interfaces/product';
import { CATEGORIES_DATA } from '@core/data/categories_data';
import { TAGS_DATA } from '@core/data/tags_data';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LoaderComponent } from '@shared/components/loader/loader.component';


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
    CustomSelectComponent,
    LoaderComponent
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

  productsOne = signal<IProduct[]>([]);
  products: IProduct[] = [];
  filteredProducts = [...this.products];
  selectedCategory = '';
  minPrice = 0;
  maxPrice = 0;

  flashMessage: 'success' | 'error' | null = null;
  selectedProduct: IProduct | null = null;
  selectedProductForm: FormGroup;

  filteredTags: any[] = [];
  tagsEditMode = false;
  categories: any[] = [];
  tags: any[] = [];
  vendors: any[] = [];

  selectedFiles: { file: File; url: string }[] = [];
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
      weight: [''],
      tags: [[]]
    });
  }

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Productos');
    this.calculateStatistics();
    this.getProducts();
    this.loadSelectOptions();

    // Escuchar cambios en precio base y porcentaje de impuesto
    this.selectedProductForm.get('basePrice')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
    this.selectedProductForm.get('taxPercent')?.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }


  /**
   * Función que calcula el precio final sumando el impuesto al precio base.
   */
  private calculatePrice(): void {
    // Obtenemos y convertimos el precio base y el porcentaje de impuesto a números
    const basePrice = parseFloat(this.selectedProductForm.get('basePrice')?.value) || 0;
    const taxPercent = parseFloat(this.selectedProductForm.get('taxPercent')?.value) || 0;

    // Calculamos el precio final: precio base + (precio base * impuesto / 100)
    const finalPrice = basePrice + (basePrice * taxPercent / 100);

    // Actualizamos el campo 'price', evitando emitir otro evento (para prevenir loops)
    this.selectedProductForm.patchValue({ price: finalPrice.toFixed(2) }, { emitEvent: false });
  }

  get products$(): Observable<IProduct[]> {
    return of(this.filteredProducts);
  }

  get categoriesOptions() {
    return this.categories.map(category => ({ id: category.id, text: category.name }));
  }

  get tagsOptions() {
    return this.tags.map(tag => ({ id: tag.uuid, text: tag.name, ...tag }));
  }

  get vendorsOptions() {
    return this.vendors.map(vendor => ({ id: vendor.id, text: vendor.name }));
  }

  loadSelectOptions(): void {
    this.categories = CATEGORIES_DATA;
    this.tags = TAGS_DATA;

    this.vendors = [
      { id: 'vendor1', name: 'Proveedor X' },
      { id: 'vendor2', name: 'Proveedor Y' },
      { id: 'vendor3', name: 'Proveedor Z' }
    ];
  }
  selectedTags: any[] = [];
  showTagSelector = false; // Bandera para mostrar/ocultar el selector de tags

  onTagSelectionChange(tag: any): void {
    // Obtenemos los tags que actualmente están en el formulario,
    // en caso de que sea undefined inicializamos a un array vacío
    const formTags = this.selectedProductForm.value.tags || [];

    // Verificamos que el tag no esté en this.selectedTags ni en formTags.
    const existsInSelectedTags = this.selectedTags.some(t => t.uuid === tag.uuid);
    const existsInFormTags: boolean = formTags.some((t: { uuid: string }) => t.uuid === tag.uuid);

    if (!existsInSelectedTags && !existsInFormTags) {
      this.selectedTags.push(tag);
    }


    // Creamos una lista combinada de tags sin duplicados.
    // Utilizamos un Map para asegurar que cada 'uuid' aparezca solo una vez.
    const mergedTagsMap = new Map();

    // Agregamos primero los tags del formulario (si existen).
    formTags.forEach((t: any) => mergedTagsMap.set(t.uuid, t));

    // Agregamos los tags de la selección local.
    this.selectedTags.forEach((t: any) => mergedTagsMap.set(t.uuid, t));

    // Convertimos el Map a un array
    const mergedTags = Array.from(mergedTagsMap.values());

    // Actualizamos el formulario con la lista combinada de tags sin duplicados.
    this.selectedProductForm.patchValue({ tags: mergedTags });

    // Cerramos el selector de tags (si está implementado para mostrarse/ocultarse)
    this.showTagSelector = false;
  }


  // Función para manejar el cambio en el mat-slide-toggle.
  onToggleActive(event: MatSlideToggleChange): void {
    const isActive = event.checked;
    // Actualiza el control "active" del formulario
    this.selectedProductForm.patchValue({ active: isActive });

    // Aquí podrías realizar una llamada al backend para actualizar el producto,
    // por ejemplo, si el producto ya existe:
    /*
    if (this.selectedProduct) {
      this._productsService.updateProduct(this.selectedProduct.id, { active: isActive }).subscribe({
        next: () => {
          this._messageService.showInfo(`Producto ${ isActive ? 'activado' : 'desactivado' } correctamente`, 'bottom right', 5000);
        },
        error: (error) => {
          console.error('Error actualizando el estado del producto:', error);
          this._messageService.showError('Error al actualizar el estado del producto', 'bottom right', 5000);
        }
      });
    }
    */
  }
  // Si necesitas remover un tag de la lista:
  removeTag(tag: any): void {
    // Eliminar el tag del array local selectedTags
    this.selectedTags = this.selectedTags.filter(t => t.uuid !== tag.uuid);

    // Obtener los tags actuales del formulario (si es undefined se inicializa a [])
    const formTags = this.selectedProductForm.value.tags || [];

    // Filtrar para remover el tag seleccionado
    const updatedFormTags = formTags.filter((t: any) => t.uuid !== tag.uuid);

    // Actualizar el formulario con la nueva lista de tags
    this.selectedProductForm.patchValue({ tags: updatedFormTags });

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
          // Crea un objeto que contenga tanto el File como la dataURL
          const imageData = { file, url: reader.result as string };
          // Actualiza el array de previews si lo necesitas
          this.imagePreviews.push(reader.result as string);
          // Agrega el objeto al array de archivos seleccionados
          this.selectedFiles.push({ file, url: reader.result as string });
          // Actualiza el form control para que contenga el array de archivos
          this.selectedProductForm.patchValue({ images: this.selectedFiles });
        };
        reader.readAsDataURL(file);
      });
    }
  }



  private getProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.map((p: any) => (
          {
            id: p.id.toString(),
            name: p.name,
            sku: p.sku,
            category: p.category,
            price: p.price,
            stock: p.stock,
            sold: p.sold,
            type: p.type,
            active: p.active || false,
            thumbnail: p.thumbnail || 'assets/default-thumbnail.png',
            description: p.description || '',
            maxPurchasePerUser: p.maxPurchasePerUser || 0,
            cost: p.cost || 0,
            basePrice: p.basePrice || 0,
            taxPercent: p.taxPercent || 0,
            weight: p.weight || 0,
            images: p.images || [],
            tags: p?.tags || []
          }));
        this.filteredProducts = [...this.products];
        this.productsOne.set(this.products);

        //  = this.productsOne().map(product => product.tags).flat();

        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }



  deleteProduct(product: IProduct): void {
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

  openImageEditor(product: IProduct): void {
    const dialogRef = this._dialog.open(EditGalleryComponent, {
      data: { product: product },
    });
    dialogRef.afterClosed().subscribe((updatedImages: any[]) => {
      if (updatedImages) {
        // Actualizar el formulario con las imágenes actualizadas
        this.selectedProductForm.patchValue({
          images: updatedImages,
          currentImageIndex: 0 // Resetear al índice 0
        });
        // Actualizar también el producto seleccionado
        if (this.selectedProduct) {
          this.selectedProduct.images = updatedImages;
        }
      }
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
          tags: product.tags,
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



  toggleTagsEditMode(): void {
    this.tagsEditMode = !this.tagsEditMode;
  }




  // trackBy para optimizar el ngFor
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // filterTagsInputKeyDown(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     const input = (event.target as HTMLInputElement).value.trim();
  //     if (input) {
  //       this.createTag(input);
  //       (event.target as HTMLInputElement).value = '';
  //     }
  //   }
  // }

  // onFilterTags(event: Event): void {
  //   // Ejemplo de filtrado de tags
  // }

  // =============================================
  // Funcionalidad para crear un producto vacío inline
  // =============================================
  createEmptyProduct(): void {
    // Verificamos si ya existe un producto vacío en la lista (id vacío)
    if (this.products.some(product => product.id === '')) {
      this._messageService.showError('Ya tenes un producto pendiente de crear', 'top center', 5000, 'aceptar');
      return; // Salir sin crear otro producto vacío
    }

    // Crear un producto vacío
    const emptyProduct: IProduct = {
      id: '', // id vacío o temporal
      name: '',
      sku: '',
      category: '',
      type: '',
      price: 0,
      stock: 0,
      sold: 0,
      active: false,
      thumbnail: '',
      images: [],
      tags: []
    };

    // Se marca que se está creando un nuevo producto y se agrega al inicio de la lista
    this.isNewProduct = true;
    this.products.unshift(emptyProduct);
    this.filteredProducts = [...this.products];
    this.selectedProduct = emptyProduct;

    // Se inicializa el formulario con valores vacíos
    this.selectedProductForm.patchValue({
      name: '',
      images: [],
      currentImageIndex: 0,
      active: false,
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
    if (this.selectedProductForm.invalid) {
      console.log('Formulario no válido', this.selectedProductForm.value);
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
    formData.append('taxPercent', this.selectedProductForm.get('taxPercent')?.value);
    formData.append('basePrice', this.selectedProductForm.get('basePrice')?.value);
    formData.append('cost', this.selectedProductForm.get('cost')?.value);

    // Convertimos el array de tags a JSON antes de enviarlo
    const tagsValue = this.selectedProductForm.get('tags')?.value;
    formData.append('tags', JSON.stringify(tagsValue));

    // Adjuntar las imágenes seleccionadas al FormData
    const images = this.selectedProductForm.get('images')?.value;


    images.forEach((file: File) => {
      formData.append('files', file);
    });

    this._productsService.createProduct(formData).subscribe({
      next: (response: any) => {
        this._messageService.showInfo('Producto creado exitosamente', 'bottom right', 5000);
        // Reiniciar archivos e imágenes
        this.selectedFiles = [];
        // Reiniciar el formulario
        this.selectedProductForm.reset();
        this.selectedProductForm.markAsPristine();
        this.selectedProductForm.markAsUntouched();
        this.getProducts();
      },
      error: (error) => {
        this._messageService.showError('Error al crear producto', 'bottom right', 5000);
      }
    });
  }

  updateSelectedProduct(): void {
    if (this.selectedProductForm.invalid || !this.selectedProduct) {
      this._messageService.showError('Formulario no válido', 'bottom right', 5000);
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    // Incluimos el id del producto, si el backend lo requiere
    formData.append('id', this.selectedProduct.id);
    formData.append('name', this.selectedProductForm.get('name')?.value);
    formData.append('category', this.selectedProductForm.get('category')?.value);
    formData.append('price', this.selectedProductForm.get('price')?.value);
    formData.append('stock', this.selectedProductForm.get('stock')?.value);
    formData.append('maxPurchasePerUser', this.selectedProductForm.get('maxPurchasePerUser')?.value);
    formData.append('description', this.selectedProductForm.get('description')?.value);
    formData.append('type', this.selectedProductForm.get('type')?.value);
    formData.append('active', this.selectedProductForm.get('active')?.value);
    formData.append('taxPercent', this.selectedProductForm.get('taxPercent')?.value);
    formData.append('basePrice', this.selectedProductForm.get('basePrice')?.value);
    formData.append('cost', this.selectedProductForm.get('cost')?.value);

    // Convertir el array de tags a JSON antes de enviarlo
    const tagsValue = this.selectedProductForm.get('tags')?.value;
    formData.append('tags', JSON.stringify(tagsValue));

    // Adjuntar las imágenes actualizadas, si es necesario
    const images = this.selectedProductForm.get('images')?.value;
    images.forEach((file: File) => {
      formData.append('files', file);
    });

    // Suponiendo que el servicio de productos tiene un método updateProduct()
    this._productsService.updateProduct(this.selectedProduct.id, formData).subscribe({
      next: (response: any) => {
        this._messageService.showInfo('Producto actualizado exitosamente', 'bottom right', 5000);
        // Actualizar el producto seleccionado con los nuevos valores
        if (this.selectedProduct) {
          this.selectedProduct.active = this.selectedProductForm.get('active')?.value;
        }
        // Reiniciar el formulario o actualizar la vista según convenga
        this.getProducts();
        this.isLoading = false;
      },
      error: (error) => {
        this._messageService.showError('Error al actualizar producto', 'bottom right', 5000);
        this.isLoading = false;
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

  // updateSelectedProduct(): void {
  //   if (this.selectedProduct) {
  //     console.log('Actualizando producto:', this.selectedProduct);
  //     this.flashMessage = 'success';
  //     setTimeout(() => {
  //       this.flashMessage = null;
  //     }, 3000);
  //   }
  // }

  deleteSelectedProduct(): void {
    console.log('selectedProduct', this.selectedProduct);
    if (this.selectedProduct) {
      // Verificar si el producto está activo
      if (this.selectedProduct.active) {
        this._messageService.showError('No se puede eliminar un producto activo. Desactívelo primero.', 'top center', 5000);
        return;
      }

      this._productsService.deleteProduct(this.selectedProduct?.id).subscribe({
        next: (response: any) => {
          this._messageService.showInfo('Producto eliminado correctamente', 'top center', 5000);
          this.selectedProduct = null;
          this.getProducts();
        },
        error: (error) => {
          this._messageService.showError('Error al eliminar producto', 'bottom right', 5000);
        }
      });
    }
  }

  deleteImage(imageId: string): void {
    if (!this.selectedProduct) {
      return;
    }

    this._productsService.deleteImage(this.selectedProduct.id, imageId).subscribe({
      next: (response: any) => {
        // Remover la imagen de la lista de imágenes del producto
        if (this.selectedProduct?.images) {
          this.selectedProduct.images = this.selectedProduct.images.filter(img => img.id !== imageId);
          // Actualizar el formulario
          this.selectedProductForm.patchValue({
            images: this.selectedProduct.images
          });
        }
        this._messageService.showInfo('Imagen eliminada correctamente', 'top center', 5000);
      },
      error: (error) => {
        this._messageService.showError('Error al eliminar la imagen', 'bottom right', 5000);
      }
    });
  }
}
