import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { StoreConfigService } from '@apis/store-config.service';
import { CategoryConfig } from '@core/models/category-config.model';
import { MessageService } from '@core/services/snackbar.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CategoriesComponent implements OnInit {
  categories: CategoryConfig[] = [];
  categoryForm: FormGroup;
  editingCategory: CategoryConfig | null = null;
  loading = false;

  constructor(
    private storeConfigService: StoreConfigService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      value: ['', Validators.required],
      slug: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.storeConfigService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.showError('Error loading categories', 'top right');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.loading = true;
      const categoryData = this.categoryForm.value;

      if (this.editingCategory) {
        this.storeConfigService.updateCategory(this.editingCategory.uuid, categoryData).subscribe({
          next: () => {
            this.messageService.showSuccess('Category updated successfully', 'top right');
            this.resetForm();
            this.loadCategories();
          },
          error: (error) => {
            this.messageService.showError('Error updating category', 'top right');
            this.loading = false;
          }
        });
      } else {
        this.storeConfigService.createCategory(categoryData).subscribe({
          next: () => {
            this.messageService.showSuccess('Category created successfully', 'top right');
            this.resetForm();
            this.loadCategories();
          },
          error: (error) => {
            this.messageService.showError('Error creating category', 'top right');
            this.loading = false;
          }
        });
      }
    }
  }

  editCategory(category: CategoryConfig): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      value: category.value,
      slug: category.slug
    });
  }

  deleteCategory(uuid: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.loading = true;
      this.storeConfigService.deleteCategory(uuid).subscribe({
        next: () => {
          this.messageService.showSuccess('Category deleted successfully', 'top right');
          this.loadCategories();
        },
        error: (error) => {
          this.messageService.showError('Error deleting category', 'top right');
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.editingCategory = null;
    this.loading = false;
  }
} 