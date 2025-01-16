import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { Dialog } from '@angular/cdk/dialog';
import LoginComponent from '../../../pages/forms/login/login.component';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(public dialog: Dialog) {}

  openDialogLogin(): void {
    const dialogRef = this.dialog.open<string>(LoginComponent, {
      width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
