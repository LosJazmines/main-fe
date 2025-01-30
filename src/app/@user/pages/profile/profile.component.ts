import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { MaterialModule } from '../../../@shared/material/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
