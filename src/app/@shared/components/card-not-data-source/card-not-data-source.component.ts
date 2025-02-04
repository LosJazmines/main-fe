import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animations } from '../../animations';
import { MaterialModule } from '../../material/material.module';
import { LucideModule } from '../../lucide/lucide.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card-not-data-source',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, RouterModule],
  templateUrl: './card-not-data-source.component.html',
  styleUrl: './card-not-data-source.component.scss',
  animations: [Animations],
})
export class CardNotDataSourceComponent {
  private _router = inject(Router);

  @Input() textTitle!: string;
  @Input() textInfo!: string;
  @Input() buttonText: string = 'Descubrir productos';

  goTo() {
    this._router.navigate(['/online-store']);
  }
}
