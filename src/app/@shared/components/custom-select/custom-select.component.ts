import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

export interface SelectOption {
  id: string[];
  text: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, LucideModule, MaterialModule],
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="toggleDropdown()"
        class="w-full p-2 text-left border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-200 flex justify-between items-center"
      >
        <span class="truncate">
          {{ selectedOption ? selectedOption.text : placeholder }}
        </span>
        <i-lucide
          name="chevron-down"
          class="w-4 h-4 transition-transform"
          [class.rotate-180]="isOpen"
        ></i-lucide>
      </button>

      <div
        *ngIf="isOpen"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-[4px] shadow-lg max-h-60 overflow-auto"
      >
        <div
          *ngFor="let option of options"
          (click)="selectOption(option)"
          class="p-2 hover:bg-gray-100 cursor-pointer"
          [class.bg-gray-50]="isSelected(option)"
        >
          {{ option.text }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent implements OnInit, OnChanges {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Seleccionar';
  @Input() initialValue: string[] = [];
  @Output() selectionChange = new EventEmitter<SelectOption>();

  isOpen = false;
  selectedOption: SelectOption | null = null;

  ngOnInit() {
    this.updateSelectedOption();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['initialValue'] || changes['options']) && this.options?.length > 0) {
      this.updateSelectedOption();
    }
  }

  private updateSelectedOption() {
    if (this.initialValue?.length > 0 && this.options?.length > 0) {
      console.log('Updating selected option with initial value:', this.initialValue);
      console.log('Available options:', this.options);
      
      this.selectedOption = this.options.find(option => {
        const optionIds = [...option.id].sort();
        const initialValues = [...this.initialValue].sort();
        console.log('Comparing:', optionIds, 'with', initialValues);
        return JSON.stringify(optionIds) === JSON.stringify(initialValues);
      }) || null;

      console.log('Selected option:', this.selectedOption);
    }
  }

  isSelected(option: SelectOption): boolean {
    if (!this.selectedOption) return false;
    const optionIds = [...option.id].sort();
    const selectedIds = [...this.selectedOption.id].sort();
    return JSON.stringify(optionIds) === JSON.stringify(selectedIds);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: SelectOption) {
    this.selectedOption = option;
    this.selectionChange.emit(option);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('app-custom-select')) {
      this.isOpen = false;
    }
  }
}
