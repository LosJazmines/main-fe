import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './@shared/material/material.module';
import { RightSidebarComponent } from './@shared/components/sidebars/right-sidebar/right-sidebar.component';
import { LeftSidebarComponent } from './@shared/components/sidebars/left-sidebar/left-sidebar.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsRightSidebarOpen } from './@shared/components/sidebars/right-sidebar/store/selectors/right-sidebar.selectors';
import { selectIsLeftSidebarOpen } from './@shared/components/sidebars/left-sidebar/store/selectors/left-sidebar.selectors';
import { toggleLeftSidebar } from './@shared/components/sidebars/left-sidebar/store/actions/left-sidebar.actions';

import { toggleRightSidebar } from './@shared/components/sidebars/right-sidebar/store/actions/right-sidebar.actions';
import { LeftSidebarFiltersComponent } from './@shared/components/sidebars/left-sidebar-filters/left-sidebar-filters.component';
import { selectIsLeftSidebarAdminOpen } from './@shared/components/sidebars/left-sidebar-filters/store/selectors/left-sidebar-admin.selectors';
import { toggleLeftSidebarAdmin } from './@shared/components/sidebars/left-sidebar-filters/store/actions/left-sidebar-admin.actions';
import { AuthService } from './@apis/auth.service';
import { TokenService } from './@core/services/token.service';
import * as userActions from './@shared/store/actions/user.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule,
    RightSidebarComponent,
    LeftSidebarComponent,
    LeftSidebarFiltersComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'LosJazmines';

  isLeftDrawerOpen$!: Observable<boolean>;
  isRightSidebarOpen$!: Observable<boolean>;
  isLeftSidebarOpen$!: Observable<boolean>;
  isLeftAdminSidebarOpen$!: Observable<boolean>;

  constructor(
    private store: Store,
    private _authService: AuthService,
    private _tokenService: TokenService
  ) {
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
  ngOnInit(): void {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const token = this._tokenService.getToken();
    console.log(token);

    if (token) {
      this._authService.validateToken(token).subscribe({
        next: (response: any) => {
          const { token, ...res } = response;

          // Almacenar el token
          this._tokenService.setToken(response.token);

          // Establecer el usuario actual en el estado
          this.store.dispatch(userActions.setCurrentUser({ currentUser: res }));

          // this._messageService.showError(
          //   'Correo o contraseña incorrectos. Por favor, intenta de nuevo.',
          //   'top right',
          //   5000,
          //   'Aceptar'
          // );
        },
        error: (err) => {
          // El token es inválido o ha expirado
          console.error('Token inválido o expirado');
        },
      });
    }
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
