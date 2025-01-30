import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { MaterialModule } from '../../../@shared/material/material.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  _router = inject(Router);

  toGoToOrderDetail() {
    this._router.navigate(['/order/1']);
  }
}
