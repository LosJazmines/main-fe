import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { StoreConfigService } from '@apis/store-config.service';
import { TagConfig } from '@core/models/tag-config.model';
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
  tagForm: FormGroup;
  editingTag: TagConfig | null = null;
  loading = false;
  tagTypes = ['flower', 'plant', 'extra'];
  selectedType = 'all';
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
      type: ['flower', Validators.required],
      description: ['', Validators.required],
      selectedType: ['all']
    });
  }

  ngOnInit(): void {
    this.loadTags();
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
      type: tag.type,
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
      type: 'flower'
    });
    this.editingTag = null;
    this.loading = false;
  }

  onTypeChange(): void {
    if (this.selectedType === 'all') {
      this.loadTags();
    } else {
      this.tags = this.tags.filter(tag => tag.type === this.selectedType);
    }
  }
} 