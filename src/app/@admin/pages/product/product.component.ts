import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export default class ProductComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Products - Product');
  }

  productForm: FormGroup;
  categories = [
    'Flores',
    'Plantas',
    'Macetas',
    'Fertilizantes',
    'Herramientas',
  ];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [
        '',
        [
          Validators.required,
          Validators.pattern(/https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)/),
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Producto agregado:', this.productForm.value);
    }
  }

  onCancel(): void {
    this.productForm.reset();
  }
}
