import { Component } from '@angular/core';
import { HeaderComponent } from '../core/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export default class AdminComponent {
  activeProducer = '';
  navbarData = navbarData;
}
