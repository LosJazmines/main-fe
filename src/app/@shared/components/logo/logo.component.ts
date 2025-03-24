import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideModule } from '@shared/lucide/lucide.module';
import { MaterialModule } from '@shared/material/material.module';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [LucideModule, MaterialModule, RouterModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

}
