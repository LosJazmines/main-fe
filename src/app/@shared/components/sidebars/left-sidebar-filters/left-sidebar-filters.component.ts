import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Animations } from '@shared/animations';
import { ShopFiltersComponent } from '@shared/components/shop-filters/shop-filters.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { LucideModule } from '@shared/lucide/lucide.module';
import { Store } from '@ngrx/store';
import { toggleLeftSidebarFilters } from './store/actions/left-sidebar-filters.actions';

@Component({
  selector: 'app-left-sidebar-filters',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, LucideModule, ShopFiltersComponent, LogoComponent],
  templateUrl: './left-sidebar-filters.component.html',
  styleUrls: ['./left-sidebar-filters.component.scss'],
  animations: [Animations],
})
export class LeftSidebarFiltersComponent implements OnInit, OnDestroy {
  scrolled = false; // Controla el estado del header

  constructor(private store: Store) { }

  ngOnInit() {

  }

  ngOnDestroy() { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
  }
  closeLeftDrawer(event: Event) {
    this.store.dispatch(toggleLeftSidebarFilters({ isOpen: false }));
    (event.target as HTMLElement).blur();
  }

}
