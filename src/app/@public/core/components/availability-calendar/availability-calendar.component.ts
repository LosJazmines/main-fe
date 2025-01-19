import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';

@Component({
  selector: 'app-availability-calendar',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
  templateUrl: './availability-calendar.component.html',
  styleUrl: './availability-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailabilityCalendarComponent {
  selected: Date | null = null; // Define `selected` sin `model`, inicializándolo a `null`.
}
