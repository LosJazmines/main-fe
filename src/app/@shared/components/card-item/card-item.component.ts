import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideModule } from '../../lucide/lucide.module';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  @Input() name!: string;
  @Input() description!: string;
  @Input() price!: number;
  @Input() image: string = '/assets/placeholder.svg'; // Imagen por defecto
  @Input() category!: string;
  @Input() isNew: boolean = false;

  constructor() {}
}
