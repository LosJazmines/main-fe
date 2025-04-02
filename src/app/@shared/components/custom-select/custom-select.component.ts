import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, LucideModule, MaterialModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent {
  @Input() options: { id: any; text: string }[] = [];
  @Input() placeholder: string = 'Selecciona una opción';
  @Output() selectionChange = new EventEmitter<any>();

  dropdownOpen: boolean = false;
  selectedOption: { id: any; text: string } | null = null;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: { id: any; text: string }) {
    this.selectedOption = option;
    this.selectionChange.emit(option);
    this.dropdownOpen = false;
  }
}
