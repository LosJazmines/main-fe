import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';

@Component({
  selector: 'app-pending-requests-indicator',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
  templateUrl: './pending-requests-indicator.component.html',
  styleUrl: './pending-requests-indicator.component.scss',
})
export class PendingRequestsIndicatorComponent {}
