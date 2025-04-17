import { Component, OnInit } from '@angular/core';
import { StoreConfigService } from '../../core/services/store-config.service';
import { StoreConfig, Category, Tag } from '../../core/types/store-config';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { LucideModule } from '@shared/lucide/lucide.module';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagConfig } from '@core/models/tag-config.model';
import { MessageService } from '@core/services/snackbar.service';
import { forkJoin } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-config',
    standalone: true,
    imports: [CommonModule, MaterialModule, LucideModule, RouterModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
    templateUrl: './config.component.html',
})
export class ConfigComponent implements OnInit {
    storeConfig: StoreConfig | null = null;
    categories: Category[] = [];
    tags: TagConfig[] = [];
    loading = false;
    error: string | null = null;
    showNewTagDialog = false;
    showNewCategoryDialog = false;
    currentBannerIndex = 0;
    currentStoreBannerIndex = 0;
    showBannerMenu = false;
    showStoreBannerMenu = false;
    editingTag: TagConfig | null = null;
    selectedTagType: 'flower' | 'plant' | 'extra' | 'all' = 'all';
    tagForm: FormGroup;
    categoryForm: FormGroup;
    editingCategory: Category | null = null;
    searchQuery = '';
    filteredTags: TagConfig[] = [];
    categorySearchQuery = '';
    filteredCategories: Category[] = [];

    // Tab management
    activeTab: 'banners' | 'categories' | 'tags' = 'banners';

    // Categories pagination
    currentCategoriesPage = 1;
    categoriesPerPage = 4;
    totalCategoriesPages = 1;
    paginatedCategories: any[] = [];

    // Tags pagination
    currentTagsPage = 1;
    tagsPerPage = 4;
    totalTagsPages = 1;
    paginatedTags: any[] = [];

    // Add new properties for filtering
    showActiveCategories = true;
    showActiveTags = true;

    constructor(
        private storeConfigService: StoreConfigService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        this.tagForm = this.fb.group({
            name: ['', Validators.required],
            type: ['flower', Validators.required]
        });

        this.categoryForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.loading = true;
        this.error = null;

        forkJoin({
            storeConfig: this.storeConfigService.getStoreConfig(),
            categories: this.storeConfigService.getCategories(this.showActiveCategories),
            tags: this.storeConfigService.getTags(this.selectedTagType === 'all' ? undefined : this.selectedTagType as 'flower' | 'plant' | 'extra', this.showActiveTags)
        }).subscribe({
            next: ({ storeConfig, categories, tags }) => {
                this.storeConfig = storeConfig;
                this.categories = categories;
                this.filteredCategories = categories;
                this.tags = tags;
                this.filteredTags = tags;
                this.loading = false;
                
                this.updateCategoriesPagination();
                this.updateTagsPagination();
            },
            error: (error) => {
                this.error = 'Error loading data';
                this.loading = false;
            }
        });
    }

    handleBannerUpload(event: Event, type: 'home' | 'store'): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.storeConfigService.uploadBanner(input.files[0], type).subscribe({
                next: (config) => {
                    this.storeConfig = config;
                },
                error: (err) => {
                    this.error = 'Error uploading banner';
                    console.error(err);
                }
            });
        }
    }

    handleBannerDelete(type: 'home' | 'store', imageUrl: string): void {
        if (!imageUrl) return;
        
        this.storeConfigService.deleteBanner(type, imageUrl).subscribe({
            next: (config) => {
                this.storeConfig = config;
                if (type === 'home') {
                    this.currentBannerIndex = 0;
                    this.showBannerMenu = false;
                } else {
                    this.currentStoreBannerIndex = 0;
                    this.showStoreBannerMenu = false;
                }
            },
            error: (err) => {
                this.error = 'Error deleting banner';
                console.error(err);
            }
        });
    }

    moveBanner(type: 'home' | 'store', currentIndex: number, direction: 'left' | 'right'): void {
        if (!this.storeConfig) return;

        const banners = type === 'home' ? this.storeConfig.homeBannerImages : this.storeConfig.storeBannerImages;
        if (!banners || banners.length <= 1) return;

        const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= banners.length) return;

        // Swap the banners
        [banners[currentIndex], banners[newIndex]] = [banners[newIndex], banners[currentIndex]];

        // Update the order property
        banners.forEach((banner, index) => {
            banner.order = index;
        });

        // Call the service to update the order
        this.storeConfigService.updateBannerOrder(type, banners).subscribe({
            next: (config) => {
                this.storeConfig = config;
                if (type === 'home') {
                    this.currentBannerIndex = newIndex;
                    this.showBannerMenu = false;
                } else {
                    this.currentStoreBannerIndex = newIndex;
                    this.showStoreBannerMenu = false;
                }
            },
            error: (err) => {
                this.error = 'Error updating banner order';
                console.error(err);
            }
        });
    }

    onSearchChange(): void {
        if (!this.searchQuery.trim()) {
            this.filteredTags = this.tags;
            return;
        }

        const query = this.searchQuery.toLowerCase().trim();
        this.filteredTags = this.tags.filter(tag => 
            tag.name.toLowerCase().includes(query) ||
            tag.slug.toLowerCase().includes(query) ||
            (tag.value && tag.value.toLowerCase().includes(query))
        );
        this.updateTagsPagination();
    }

    onTagTypeChange(type: 'flower' | 'plant' | 'extra' | 'all'): void {
        this.selectedTagType = type;
        this.loading = true;
        this.searchQuery = '';
        
        this.storeConfigService.getTags(
            type === 'all' ? undefined : type as 'flower' | 'plant' | 'extra',
            this.showActiveTags
        ).subscribe({
            next: (tags) => {
                this.tags = tags;
                this.filteredTags = tags;
                this.loading = false;
                this.updateTagsPagination();
            },
            error: (error) => {
                this.error = 'Error loading tags';
                this.loading = false;
            }
        });
    }

    editTag(tag: TagConfig): void {
        this.editingTag = tag;
        this.tagForm.patchValue({
            name: tag.name,
            slug: tag.slug,
            value: tag.value,
            type: tag.type,
            description: tag.description
        });
        this.showNewTagDialog = true;
    }

    deleteTag(uuid: string): void {
        if (confirm('Are you sure you want to delete this tag?')) {
            this.loading = true;
            this.storeConfigService.deleteTag(uuid).subscribe({
                next: () => {
                    this.tags = this.tags.filter(t => t.uuid !== uuid);
                    this.filteredTags = this.filteredTags.filter(t => t.uuid !== uuid);
                    this.messageService.showSuccess('Tag deleted successfully', 'top right');
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.showError('Error deleting tag', 'top right');
                    this.loading = false;
                }
            });
        }
    }

    onSubmit(): void {
        if (this.tagForm.invalid) return;

        this.loading = true;
        const tagData = {
            name: this.tagForm.get('name')?.value,
            type: this.tagForm.get('type')?.value
        };

        this.storeConfigService.createTag(tagData).subscribe({
            next: (newTag) => {
                this.tags.push(newTag);
                this.filteredTags = [...this.tags];
                this.messageService.showSuccess('Tag created successfully', 'top right');
                this.showNewTagDialog = false;
                this.tagForm.reset();
                this.loading = false;
                this.updateTagsPagination();
            },
            error: (error) => {
                this.messageService.showError(error.error?.message || 'Error creating tag', 'top right');
                this.loading = false;
            }
        });
    }

    editCategory(category: Category): void {
        this.editingCategory = category;
        this.categoryForm.patchValue({
            name: category.name,
            slug: category.slug,
            value: category.value
        });
        this.showNewCategoryDialog = true;
    }

    deleteCategory(uuid: string): void {
        if (confirm('Are you sure you want to delete this category?')) {
            this.loading = true;
            this.storeConfigService.deleteCategory(uuid).subscribe({
                next: () => {
                    this.categories = this.categories.filter(c => c.uuid !== uuid);
                    this.filteredCategories = this.filteredCategories.filter(c => c.uuid !== uuid);
                    this.messageService.showSuccess('Category deleted successfully', 'top right');
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.showError('Error deleting category', 'top right');
                    this.loading = false;
                }
            });
        }
    }

    onSubmitCategory(): void {
        if (this.categoryForm.invalid) return;

        this.loading = true;
        const categoryData = { name: this.categoryForm.get('name')?.value };

        this.storeConfigService.createCategory(categoryData).subscribe({
            next: (newCategory) => {
                this.categories.push(newCategory);
                this.filteredCategories = [...this.categories];
                this.messageService.showSuccess('Category created successfully', 'top right');
                this.showNewCategoryDialog = false;
                this.categoryForm.reset();
                this.loading = false;
                this.updateCategoriesPagination();
            },
            error: (error) => {
                this.messageService.showError(error.error?.message || 'Error creating category', 'top right');
                this.loading = false;
            }
        });
    }

    toggleBannerMenu(): void {
        this.showBannerMenu = !this.showBannerMenu;
    }

    toggleStoreBannerMenu(): void {
        this.showStoreBannerMenu = !this.showStoreBannerMenu;
    }

    nextBanner(): void {
        if (this.storeConfig?.homeBannerImages && this.currentBannerIndex < (this.storeConfig.homeBannerImages.length - 1)) {
            this.currentBannerIndex++;
        }
    }

    prevBanner(): void {
        if (this.currentBannerIndex > 0) {
            this.currentBannerIndex--;
        }
    }

    nextStoreBanner(): void {
        if (this.storeConfig?.storeBannerImages && this.currentStoreBannerIndex < (this.storeConfig.storeBannerImages.length - 1)) {
            this.currentStoreBannerIndex++;
        }
    }

    prevStoreBanner(): void {
        if (this.currentStoreBannerIndex > 0) {
            this.currentStoreBannerIndex--;
        }
    }

    onCategorySearchChange(): void {
        if (!this.categorySearchQuery.trim()) {
            this.filteredCategories = this.categories;
        } else {
            const query = this.categorySearchQuery.toLowerCase().trim();
            this.filteredCategories = this.categories.filter(category => 
                category.name.toLowerCase().includes(query)
            );
        }
        this.updateCategoriesPagination();
    }

    toggleTagActive(tag: TagConfig): void {
        this.loading = true;
        this.storeConfigService.updateTag(tag.uuid, { isActive: !tag.isActive }).subscribe({
            next: (updatedTag) => {
                const index = this.tags.findIndex(t => t.uuid === tag.uuid);
                if (index !== -1) {
                    this.tags[index] = updatedTag;
                    this.filteredTags = [...this.tags];
                }
                this.messageService.showSuccess('Tag status updated successfully', 'top right');
                this.loading = false;
            },
            error: (error) => {
                this.messageService.showError('Error updating tag status', 'top right');
                this.loading = false;
            }
        });
    }

    toggleCategoryActive(category: Category): void {
        this.loading = true;
        this.storeConfigService.updateCategory(category.uuid, { isActive: !category.isActive }).subscribe({
            next: (updatedCategory) => {
                const index = this.categories.findIndex(c => c.uuid === category.uuid);
                if (index !== -1) {
                    this.categories[index] = updatedCategory;
                    this.filteredCategories = [...this.categories];
                }
                this.messageService.showSuccess('Category status updated successfully', 'top right');
                this.loading = false;
            },
            error: (error) => {
                this.messageService.showError('Error updating category status', 'top right');
                this.loading = false;
            }
        });
    }

    // Categories pagination methods
    onCategoriesPerPageChange() {
        this.currentCategoriesPage = 1;
        this.updateCategoriesPagination();
    }

    prevCategoriesPage() {
        if (this.currentCategoriesPage > 1) {
            this.currentCategoriesPage--;
            this.updateCategoriesPagination();
        }
    }

    nextCategoriesPage() {
        if (this.currentCategoriesPage < this.totalCategoriesPages) {
            this.currentCategoriesPage++;
            this.updateCategoriesPagination();
        }
    }

    updateCategoriesPagination() {
        const startIndex = (this.currentCategoriesPage - 1) * this.categoriesPerPage;
        const endIndex = startIndex + this.categoriesPerPage;
        this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
        this.totalCategoriesPages = Math.ceil(this.filteredCategories.length / this.categoriesPerPage);
    }

    // Tags pagination methods
    onTagsPerPageChange() {
        this.currentTagsPage = 1;
        this.updateTagsPagination();
    }

    prevTagsPage() {
        if (this.currentTagsPage > 1) {
            this.currentTagsPage--;
            this.updateTagsPagination();
        }
    }

    nextTagsPage() {
        if (this.currentTagsPage < this.totalTagsPages) {
            this.currentTagsPage++;
            this.updateTagsPagination();
        }
    }

    updateTagsPagination() {
        const startIndex = (this.currentTagsPage - 1) * this.tagsPerPage;
        const endIndex = startIndex + this.tagsPerPage;
        this.paginatedTags = this.filteredTags.slice(startIndex, endIndex);
        this.totalTagsPages = Math.ceil(this.filteredTags.length / this.tagsPerPage);
    }
} 