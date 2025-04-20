import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { StoreConfigService } from '@apis/store-config.service';
import { TagConfig } from '@core/models/tag-config.model';
import { CategoryConfig } from '@core/models/category-config.model';
import { MessageService } from '@core/services/snackbar.service';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule]
})
export class TagsComponent implements OnInit {
  tags: TagConfig[] = [];
  categories: CategoryConfig[] = [];
  tagForm: FormGroup;
  editingTag: TagConfig | null = null;
  loading = false;
  selectedCategory = 'all';
  isAdding = false;
  error: string | null = null;

  constructor(
    private storeConfigService: StoreConfigService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.tagForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      value: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      categoryUuid: ['', Validators.required],
      description: ['', Validators.required],
      selectedCategory: ['all']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTags();
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

  loadTags(): void {
    this.loading = true;
    this.storeConfigService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.showError('Error loading tags', 'top right');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.tagForm.valid) {
      this.loading = true;
      const tagData = this.tagForm.value;

      if (this.editingTag) {
        this.storeConfigService.updateTag(this.editingTag.uuid, tagData).subscribe({
          next: () => {
            this.messageService.showSuccess('Tag updated successfully', 'top right');
            this.resetForm();
            this.loadTags();
          },
          error: (error) => {
            this.messageService.showError('Error updating tag', 'top right');
            this.loading = false;
          }
        });
      } else {
        this.storeConfigService.createTag(tagData).subscribe({
          next: () => {
            this.messageService.showSuccess('Tag created successfully', 'top right');
            this.resetForm();
            this.loadTags();
          },
          error: (error) => {
            this.messageService.showError('Error creating tag', 'top right');
            this.loading = false;
          }
        });
      }
    }
  }

  editTag(tag: TagConfig): void {
    this.editingTag = tag;
    this.tagForm.patchValue({
      name: tag.name,
      value: tag.value,
      slug: tag.slug,
      categoryUuid: tag.categoryUuid,
      description: tag.description
    });
  }

  deleteTag(uuid: string): void {
    if (confirm('Are you sure you want to delete this tag?')) {
      this.loading = true;
      this.storeConfigService.deleteTag(uuid).subscribe({
        next: () => {
          this.messageService.showSuccess('Tag deleted successfully', 'top right');
          this.loadTags();
        },
        error: (error) => {
          this.messageService.showError('Error deleting tag', 'top right');
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.tagForm.reset({
      categoryUuid: ''
    });
    this.editingTag = null;
    this.loading = false;
  }

  onCategoryChange(): void {
    if (this.selectedCategory === 'all') {
      this.loadTags();
    } else {
      this.storeConfigService.getTags(this.selectedCategory).subscribe({
        next: (tags) => {
          this.tags = tags;
        },
        error: (error) => {
          this.messageService.showError('Error loading tags for category', 'top right');
        }
      });
    }
  }

  updateTag(tag: TagConfig, field: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const updatedTag = { ...tag, [field]: input.value };
    
    this.storeConfigService.updateTag(tag.uuid, updatedTag).subscribe({
      next: () => {
        this.messageService.showSuccess('Tag updated successfully', 'top right');
        this.loadTags();
      },
      error: (error) => {
        this.messageService.showError('Error updating tag', 'top right');
      }
    });
  }
} 