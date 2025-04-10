import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
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

  gallerys = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<EditGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productsService: ProductsService,
    private _messageService: MessageService
  ) {
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

  closeImageEditor(): void {
    if (this.dialogRef) {
      this.dialogRef.close(this.gallerys());
    }
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        console.log(imageUrl);
        // Lógica para agregar la imagen al listado
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage(imageId: string): void {
    if (!this.data?.product?.id) {
      this._messageService.showError('No se pudo obtener el ID del producto', 'bottom right', 5000);
      return;
    }

    this.isLoading.set(true);

    this._productsService.deleteImage(this.data.product.id, imageId).subscribe({
      next: (response: any) => {
        // Remover la imagen de la lista
        const updatedImages = this.gallerys().filter(img => img.id !== imageId);
        this.gallerys.set(updatedImages);
        
        // Si no hay más imágenes, actualizar la vista
        if (updatedImages.length === 0) {
          this.gallerys.set([]);
        }
        
        this._messageService.showInfo('Imagen eliminada correctamente', 'top center', 5000);
        this.isLoading.set(false);
        // this.closeImageEditor();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar la imagen:', error);
        this._messageService.showError('Error al eliminar la imagen', 'bottom right', 5000);
        this.isLoading.set(false);
      }
    });
  }

  openImageEditor(): void {
    // Lógica adicional para abrir el editor, si es necesario
  }
}
