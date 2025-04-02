import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  styleUrl: './edit-gallery.component.scss'
})
export class EditGalleryComponent implements OnInit {

  gallerys = signal<any[]>([]);

  constructor(
    // private formBuilder: FormBuilder,
    // private dialogRef: MatDialogRef<EditGalleryComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.getGalleryImages();
  }


  getGalleryImages(): void {
    // this.gallerys.set(this.data.gallerys);
  }

  closeImageEditor() {
    // this.showImageEditor = false;
  }



  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        console.log(imageUrl);

        // Obtiene el array actual de imágenes o inicializa un array vacío
        // const images = this.selectedProductForm.get('images')?.value || [];
        // images.push(imageUrl);
        // // Actualiza el formulario con la nueva lista de imágenes y reinicia el índice actual
        // this.selectedProductForm.patchValue({ images, currentImageIndex: images.length - 1 });
      };
      reader.readAsDataURL(file);
    }
  }

  openImageEditor(): void {

  }

}
