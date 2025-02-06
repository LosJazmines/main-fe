import { Component, Inject, inject, OnInit } from '@angular/core';
import { AdminHeaderStore } from '../../../../@core/store/admin-header.store';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../../../@apis/products.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../../@core/services/token.service';
import { MessageService } from '../../../../@core/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { RouterModule } from '@angular/router';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  productForm!: FormGroup;
  imageUrl!: FormControl;
  imageList: string[] = [];
  isUrlInvalid: boolean = false;

  categories = [
    'Flores', // Flores frescas y arreglos florales
    'Ramos y Bouquets', // Ramos para diferentes ocasiones
    'Plantas', // Plantas vivas, ornamentales, y de interior/exterior
    'Macetas', // Macetas de diversos tamaños y estilos
    'Fertilizantes', // Productos para cuidar las plantas
    'Herramientas', // Herramientas de jardinería
    'Decoración', // Artículos decorativos como velas, figuras, etc.
    'Chocolates', // Chocolates para regalos
    'Peluches', // Osos y otros peluches
    'Cajas de Regalo', // Cajas de regalo personalizadas
    'Eventos y Festividades', // Decoraciones y productos para eventos (cumpleaños, bodas)
    'Bautismo', // Productos específicos para bautismos
    'Nacimiento', // Regalos para recién nacidos
    'Novia', // Arreglos y detalles para novias
    'Funerales', // Arreglos funerarios
    'Centros de Mesa', // Decoraciones de mesa
    'Tarjetas Personalizadas', // Tarjetas para acompañar los regalos
    'Regalos Personalizados', // Regalos con personalización
    'Rosas Eternas', // Rosas preservadas de larga duración
    'Ambientadores', // Aromatizantes para el hogar
  ];

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    private _dialog: Dialog,

    @Inject(DIALOG_DATA) public data: any,
    private _productsService: ProductsService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Products - Product');
    this.initGroupLogin();
  }

  private initGroupLogin() {
    this.imageUrl = new FormControl('');

    this.productForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      // offerPrice: [null, Validators.min(0)],
      stock: [null, [Validators.required, Validators.min(0)]],
      maxPurchasePerUser: [null, [Validators.required, Validators.min(0)]],

      // sku: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      // tags: [''],
      // imageUrl: [
      //   '',

      // ],
      // images: [this.imagePreview, [Validators.required]],
      // observations: [''],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      console.log('Formulario no válido', this.productForm.value);
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('maxPurchasePerUser', this.productForm.get('maxPurchasePerUser')?.value);
    formData.append('description', this.productForm.get('description')?.value);
  
    // Adjuntar las imágenes seleccionadas al FormData
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
  
    this._productsService.createProduct(formData).subscribe({
      next: (response: any) => {
        console.log('Producto creado:', response);
        // Limpiar los archivos después de un envío exitoso
        this.selectedFiles = [];
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
      },
    });
  }

   // Manejar la selección de imágenes
   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files: File[] = Array.from(input.files);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
        this.selectedFiles.push(file);
      });
    }
  }
  
  addImage() {
    console.log('Añadir imagen');
    let imageUrl = this.imageUrl.value;
    if (imageUrl) {
      this.imageList.push(imageUrl);
      return;
    }
  }
  // Cambiar la imagen principal
  setMainImage(index: number): void {
    const selectedImage = this.imagePreviews[index];
    this.imagePreviews.splice(index, 1); // Eliminar de la lista
    this.imagePreviews.unshift(selectedImage); // Mover a principal
  }

  // Eliminar imagen
  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  onCancel(): void {
    this.productForm.reset();
  }
}
