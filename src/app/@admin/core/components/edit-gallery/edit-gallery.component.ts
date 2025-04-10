import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';
import { ProductsService } from '@apis/products.service';
import { MessageService } from '@core/services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-edit-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    ReactiveFormsModule,
    LoaderComponent
  ],
  templateUrl: './edit-gallery.component.html',
  styleUrls: ['./edit-gallery.component.scss']
})
export class EditGalleryComponent implements OnInit {

  // Lista de imágenes que se muestra en la galería
  gallerys = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<EditGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productsService: ProductsService,
    private _messageService: MessageService
  ) {
    // Cierra el diálogo al hacer click en el backdrop
    this.dialogRef.backdropClick().subscribe(() => {
      this.closeImageEditor();
    });
  }

  ngOnInit(): void {
    this.getGalleryImages();
  }

  getGalleryImages(): void {
    if (this.data?.product?.images) {
      this.gallerys.set(this.data.product.images);
    }
  }

  /**
   * Cierra el diálogo devolviendo la lista actualizada de imágenes.
   */
  closeImageEditor(): void {
    this.dialogRef.close(this.gallerys());
  }

  /**
   * Subida de imagen mediante un <input type="file">.
   * Agrega la nueva imagen a la lista (se asigna un id temporal) y limpia el input.
   */
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        // Crea una imagen con un id temporal. Este id puede reemplazarse al guardarla en el backend.
        const newImage = { id: Date.now().toString(), url: imageUrl };
        // Se agrega la nueva imagen a la lista actual
        this.gallerys.update((prevImages) => [...prevImages, newImage]);
      };
      reader.readAsDataURL(file);
      // Limpiar el input para poder seleccionar el mismo archivo si es necesario
      input.value = '';
    }
  }

  /**
   * Elimina la imagen cuyo id se pasa como argumento.
   * Se actualiza la lista de imágenes usando la señal.
   */
  deleteImage(imageId: string): void {
    if (!this.data?.product?.id) {
      this._messageService.showError('No se pudo obtener el ID del producto', 'bottom right', 5000);
      return;
    }

    this.isLoading.set(true);

    this._productsService.deleteImage(this.data.product.id, imageId).subscribe({
      next: (response: any) => {
        // Filtra y elimina la imagen de la lista
        this.gallerys.update(images => images.filter(img => img.id !== imageId));
        this._messageService.showInfo('Imagen eliminada correctamente', 'top center', 5000);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar la imagen:', error);
        this._messageService.showError('Error al eliminar la imagen', 'bottom right', 5000);
        this.isLoading.set(false);
      }
    });
  }

  openImageEditor(): void {
    // Aquí puedes agregar lógica adicional si fuera necesaria para abrir/editar la imagen
  }

  trackByFn(index: number, item: any): any {

    return item.id; // Replace 'id' with the unique identifier of your gallery items

  }
}
