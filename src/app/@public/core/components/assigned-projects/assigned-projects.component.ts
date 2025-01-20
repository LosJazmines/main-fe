import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';

@Component({
  selector: 'app-assigned-projects',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
  templateUrl: './assigned-projects.component.html',
  styleUrl: './assigned-projects.component.scss',
})
export class AssignedProjectsComponent {}
