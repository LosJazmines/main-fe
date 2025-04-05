import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, Optional, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-edit-gallery',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,

    LucideModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-gallery.component.html',
  styleUrls: ['./edit-gallery.component.scss']
})
export class EditGalleryComponent implements OnInit {

  gallerys = signal<any[]>([]);

  constructor(

    public dialogRef: MatDialogRef<EditGalleryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialog: MatDialog,
    // public dialogRef: MatDialogRef<EditGalleryComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getGalleryImages();
  }

  getGalleryImages(): void {
    console.log('Datos inyectados:');
    console.log(this.data);
    this.gallerys.set(this.data.product?.images);
    // Puedes acceder a data.product.images si es necesario
  }

  closeImageEditor(): void {
    // Si dialogRef existe, cierra el diálogo
    if (this.dialogRef) {
      this.dialogRef.close();
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

  openImageEditor(): void {
    // Lógica adicional para abrir el editor, si es necesario
  }
}
