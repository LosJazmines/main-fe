import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { PipesModule } from '@core/pipes/pipes.module';
import { Animations } from '@shared/animations';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-checkout-failure',
  standalone: true,
  imports: [
    CommonModule,
    LucideModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  templateUrl: './checkout-failure.component.html',
  styleUrl: './checkout-failure.component.scss',
  animations: [Animations]

})
export class CheckoutFailureComponent {
  constructor(
    // public dialogRef: MatDialogRef<CheckoutFailureComponent>,
    private router: Router
  ) { }

  onClose() {
    // this.dialogRef.close();
  }

  goToEvents() {
    this.router.navigate(['/']);
    this.onClose();
  }
}

