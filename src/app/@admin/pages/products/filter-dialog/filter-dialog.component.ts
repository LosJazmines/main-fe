import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LucideModule } from '@shared/lucide/lucide.module';
import { CATEGORIES_DATA } from '@core/data/categories_data';
import { TAGS_DATA } from '@core/data/tags_data';

@Component({
    selector: 'app-filter-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        LucideModule
    ],
    templateUrl: './filter-dialog.component.html'
})
export class FilterDialogComponent {
    categories = CATEGORIES_DATA;
    tags = TAGS_DATA;

    filters = {
        selectedCategory: null as string | null,
        selectedTag: null as string | null,
        minPrice: null as number | null,
        maxPrice: null as number | null,
        active: null as boolean | null
    };

    constructor(
        public dialogRef: MatDialogRef<FilterDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data.filters) {
            this.filters = { ...data.filters };
        }
    }

    applyFilters(): void {
        this.dialogRef.close(this.filters);
    }

    clearFilters(): void {
        this.filters = {
            selectedCategory: null,
            selectedTag: null,
            minPrice: null,
            maxPrice: null,
            active: null
        };
    }

    close(): void {
        this.dialogRef.close();
    }
} 