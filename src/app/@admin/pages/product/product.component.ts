import { Component, Inject, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../@apis/auth.service';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { Store } from '@ngrx/store';
import { ProductsService } from '../../../@apis/products.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export default class ProductComponent implements OnInit {
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
  constructor(
    private _fb: FormBuilder,
    // public dialogRef: DialogRef<string>,
    // private _dialog: Dialog,
    // @Inject(DIALOG_DATA) public data: any,
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
      // sku: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      // tags: [''],
      // imageUrl: [
      //   '',

      // ],
      images: [this.imageList, [Validators.required]],
      // observations: [''],
    });
  }

  onSubmit(): void {
    // console.log('Producto agregado value:', this.productForm.value);

    //   console.log('Producto agregado:', this.productForm.value);

      const formData = this.productForm.value;
      // Llamada al servicio de autenticación para registrar al usuario
      this._productsService.createProduct(formData).subscribe({
        next: (response: any) => {
          // const { token, ...res } = response;
          console.log({ response });

          // Almacenar el token
          // this._tokenService.setToken(response.token);

          // Establecer el usuario actual en el estado
          // this.store.dispatch(userActions.setCurrentUser({ currentUser: res }));

          // this._messageService.showError(
          //   'Correo o contraseña incorrectos. Por favor, intenta de nuevo.',
          //   'top right',
          //   5000,
          //   'Aceptar'
          // );
          // this.dialogRef.close();

          // Puedes agregar un mensaje de éxito o redirigir al usuario a otra página
        },
        error: (error) => {
          // En caso de error, se maneja aquí
          console.error('Error al Ingresar usuario:', error);
          // Puedes mostrar un mensaje de error si es necesario
        },
      });
    // } else {
    //   console.log('Formulario no válido');
    // }
  }


  addImage() {
    console.log('Añadir imagen');
    let imageUrl = this.imageUrl.value;
    if (imageUrl) {
      this.imageList.push(imageUrl);
      return;
    }

  }

  removeImage(index: number) {
    this.imageList.splice(index, 1);
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
