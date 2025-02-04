import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../@shared/components/header/header.component';
import { FooterComponent } from '../../@shared/components/footer/footer.component';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
})
export default class PublicComponent {}
