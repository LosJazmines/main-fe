import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './@shared/material/material.module';
import { RightSidebarComponent } from './@shared/components/sidebars/right-sidebar/right-sidebar.component';
import { LeftSidebarComponent } from './@shared/components/sidebars/left-sidebar/left-sidebar.component';
import { LeftSidebarAdminComponent } from './@shared/components/sidebars/left-sidebar-admin/left-sidebar-admin.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsRightSidebarOpen } from './@shared/components/sidebars/right-sidebar/store/selectors/right-sidebar.selectors';
import { selectIsLeftSidebarOpen } from './@shared/components/sidebars/left-sidebar/store/selectors/left-sidebar.selectors';
import { selectIsLeftSidebarAdminOpen } from './@shared/components/sidebars/left-sidebar-admin/store/selectors/left-sidebar-admin.selectors';
import { toggleLeftSidebar } from './@shared/components/sidebars/left-sidebar/store/actions/left-sidebar.actions';
import { toggleLeftSidebarAdmin } from './@shared/components/sidebars/left-sidebar-admin/store/actions/left-sidebar-admin.actions';
import { toggleRightSidebar } from './@shared/components/sidebars/right-sidebar/store/actions/right-sidebar.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    RightSidebarComponent,
    LeftSidebarComponent,
    LeftSidebarAdminComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'LosJazmines';

  isLeftDrawerOpen$!: Observable<boolean>;
  isRightSidebarOpen$!: Observable<boolean>;
  isLeftSidebarOpen$!: Observable<boolean>;
  isLeftAdminSidebarOpen$!: Observable<boolean>;

  constructor(private store: Store) {
    // Suscribirse a los estados de ambos drawers
    // this.isLeftDrawerOpen$ = this.store.select(selectIsLeftDrawerOpen);

    // New Store Sidebar
    this.isRightSidebarOpen$ = this.store.select(selectIsRightSidebarOpen);
    this.isLeftSidebarOpen$ = this.store.select(selectIsLeftSidebarOpen);
    this.isLeftAdminSidebarOpen$ = this.store.select(
      selectIsLeftSidebarAdminOpen
    );

    // Puedes cambiar el idioma según las preferencias del usuario
  }

  closeLeftDrawer() {
    this.store.dispatch(
      toggleLeftSidebar({ isOpen: !this.isLeftSidebarOpen$ })
    );
  }

  closeLeftDrawerAdmin() {
    this.store.dispatch(
      toggleLeftSidebarAdmin({ isOpen: !this.isLeftAdminSidebarOpen$ })
    );
  }

  closeRightDrawer() {
    this.store.dispatch(
      toggleRightSidebar({ isOpen: !this.isRightSidebarOpen$ })
    );
  }
}
