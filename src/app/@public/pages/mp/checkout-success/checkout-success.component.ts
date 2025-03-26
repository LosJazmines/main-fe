import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Animations } from '../../../../@shared/animations';
import { PipesModule } from '../../../../@core/pipes/pipes.module';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';


@Component({
  selector: 'app-checkout-success',
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

  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
  animations: [Animations]
})
export class CheckoutSuccessComponent {
  constructor(
    // public dialogRef: MatDialogRef<CheckoutSuccessComponent>,
    private router: Router
  ) { }

  onClose() {
    // this.dialogRef.close();
  }

  goToEvents() {
    this.router.navigate(['/']);
    this.onClose();
  }

  goToTransactions() {
    this.router.navigate(['']);
    this.onClose();
  }
}

