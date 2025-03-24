import { Store } from '@ngrx/store';
import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideModule } from '../../../lucide/lucide.module';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { Animations } from '@shared/animations';
import { toggleLeftSidebar } from './store/actions/left-sidebar.actions';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, LucideModule, LogoComponent],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  animations: [Animations],
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  @ViewChild('menuButton') menuButton: any;

  constructor(private store: Store) { }

  ngOnInit() {
    if (this.menuButton) {
      this.menuButton.nativeElement.blur();
    }
  }
  
  ngOnDestroy() { }

  closeLeftDrawer(event: Event) {
    this.store.dispatch(toggleLeftSidebar({ isOpen: false }));
    (event.target as HTMLElement).blur();
  }
}
