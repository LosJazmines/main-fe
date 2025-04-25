import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenService } from '@core/services/splash-screen.service';
import { Animations } from '@shared/animations';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  animations: [Animations],
})
export class SplashScreenComponent {
  constructor(public splashScreenService: SplashScreenService) {}
}
