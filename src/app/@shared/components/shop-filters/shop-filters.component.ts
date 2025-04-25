import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideModule } from '../../lucide/lucide.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material/material.module';
import { StoreConfigService } from '@apis/store-config.service';
import { CategoryConfig } from '@core/models/category-config.model';
import { TagConfig } from '@core/models/tag-config.model';

@Component({
  selector: 'app-shop-filters',
  standalone: true,
  imports: [CommonModule, LucideModule, FormsModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './shop-filters.component.html',
  styleUrls: ['./shop-filters.component.scss'],
})
export class ShopFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    selectedCategory: null as string | null,
    selectedTag: null as string | null,
    priceRange: { min: null as number | null, max: null as number | null }
  };

  categories: CategoryConfig[] = [];
  tags: TagConfig[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private storeConfigService: StoreConfigService
  ) { }

  ngOnInit(): void {
    this.loadCategoriesAndTags();
    this.loadFiltersFromUrl();
  }

  private loadFiltersFromUrl(): void {
    this.route.queryParams.subscribe(params => {
      const categorySlug = params['category'];
      const tagSlug = params['tag'];
      const minPrice = params['minPrice'];
      const maxPrice = params['maxPrice'];

      if (this.categories.length && categorySlug) {
        const category = this.categories.find(cat => cat.slug === categorySlug);
        this.filters.selectedCategory = category?.uuid || null;
      }

      if (this.tags.length && tagSlug) {
        const tag = this.tags.find(t => t.slug === tagSlug);
        this.filters.selectedTag = tag?.uuid || null;
      }

      this.filters.priceRange = {
        min: minPrice ? +minPrice : null,
        max: maxPrice ? +maxPrice : null
      };

      this.emitFiltersChanged();
    });
  }

  private loadCategoriesAndTags(): void {
    console.log('Starting to load categories and tags...');
    
    // Load categories
    this.storeConfigService.getCategories().subscribe({
      next: (categories) => {
        console.log('Categories loaded:', categories);
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Load tags
    this.storeConfigService.getTags().subscribe({
      next: (tags) => {
        console.log('Tags loaded from service:', tags);
        this.tags = tags;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
      }
    });
  }

  private updateQueryParams() {
    const selectedCategory = this.categories.find(cat => cat.uuid === this.filters.selectedCategory);
    const selectedTag = this.tags.find(tag => tag.uuid === this.filters.selectedTag);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: selectedCategory?.slug || null,
        tag: selectedTag?.slug || null,
        minPrice: this.filters.priceRange.min,
        maxPrice: this.filters.priceRange.max,
      },
      queryParamsHandling: 'merge',
    });

    this.emitFiltersChanged();
  }

  onPriceInput() {
    this.updateQueryParams();
  }

  selectCategory(categoryUuid: string) {
    this.filters.selectedCategory = categoryUuid;
    this.updateQueryParams();
  }

  selectTag(tagUuid: string) {
    this.filters.selectedTag = tagUuid;
    this.updateQueryParams();
  }

  clearFilters() {
    this.filters = {
      selectedCategory: null,
      selectedTag: null,
      priceRange: { min: null, max: null }
    };
    this.updateQueryParams();
  }

  private emitFiltersChanged() {
    this.filtersChanged.emit({
      category: this.filters.selectedCategory,
      tag: this.filters.selectedTag,
      priceRange: this.filters.priceRange
    });
  }
}
