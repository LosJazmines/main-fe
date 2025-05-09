import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export default class AboutComponent {
  activeItem: string | null = null;

  toggleAccordion(item: string) {
    this.activeItem = this.activeItem === item ? null : item;
  }
}
