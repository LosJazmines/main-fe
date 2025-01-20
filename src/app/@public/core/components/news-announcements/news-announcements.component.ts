import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';

@Component({
  selector: 'app-news-announcements',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule],
  templateUrl: './news-announcements.component.html',
  styleUrl: './news-announcements.component.scss',
})
export class NewsAnnouncementsComponent {}
