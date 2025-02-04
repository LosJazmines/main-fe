import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideModule } from '../../lucide/lucide.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-circle-filter',
  standalone: true,
  imports: [CommonModule, LucideModule, FormsModule],
  templateUrl: './circle-filter.component.html',
  styleUrls: ['./circle-filter.component.scss'],
})
export class CircleFilterComponent {
  @Input() categoryName: string = '';
  @Input() iconPath: string = '';
  @Output() categorySelected = new EventEmitter<string>();

  onSelectCategory(): void {
    this.categorySelected.emit(this.categoryName);
  }
}
