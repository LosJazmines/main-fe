import { Component } from '@angular/core';
import { LucideModule } from '@shared/lucide/lucide.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
