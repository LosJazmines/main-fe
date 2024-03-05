import { Component } from '@angular/core';
import { SplashScreenService } from '../../services/splash-screen.service';
import { Animations } from '../../animations';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  animations: [Animations],
})
export class SplashScreenComponent {
  constructor(public _splashScreenService: SplashScreenService) {}
}
