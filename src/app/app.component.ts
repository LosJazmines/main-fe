import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './@shared/material/material.module';
import { RightSidebarComponent } from './@shared/components/sidebars/right-sidebar/right-sidebar.component';
import { LeftSidebarComponent } from './@shared/components/sidebars/left-sidebar/left-sidebar.component';
import { Observable, pipe, retry } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsRightSidebarOpen } from './@shared/components/sidebars/right-sidebar/store/selectors/right-sidebar.selectors';
import { selectIsLeftSidebarOpen } from './@shared/components/sidebars/left-sidebar/store/selectors/left-sidebar.selectors';
import { toggleLeftSidebar } from './@shared/components/sidebars/left-sidebar/store/actions/left-sidebar.actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { toggleRightSidebar } from './@shared/components/sidebars/right-sidebar/store/actions/right-sidebar.actions';
import { LeftSidebarFiltersComponent } from './@shared/components/sidebars/left-sidebar-filters/left-sidebar-filters.component';
import { AuthService } from './@apis/auth.service';
import { TokenService } from './@core/services/token.service';
import * as userActions from './@shared/store/actions/user.actions';
import { toggleLeftSidebarFilters } from '@shared/components/sidebars/left-sidebar-filters/store/actions/left-sidebar-filters.actions';
import { selectIsLeftSidebarFiltersOpen } from '@shared/components/sidebars/left-sidebar-filters/store/selectors/left-sidebar-filters.selectors';
import { SplashScreenComponent } from '@shared/components/splash-screen/splash-screen.component';

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
    SplashScreenComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'LosJazmines';

  isLeftDrawerOpen$!: Observable<boolean>;
  isRightSidebarOpen$!: Observable<boolean>;
  isLeftSidebarOpen$!: Observable<boolean>;
  isLeftFilterSidebarOpen$!: Observable<boolean>;

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
    this.isLeftFilterSidebarOpen$ = this.store.select(
      selectIsLeftSidebarFiltersOpen
    );

    // Puedes cambiar el idioma según las preferencias del usuario
  }
  ngOnInit(): void {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    const token = this._tokenService.getToken();
    console.log({token});

    if (token) {
      this._authService
        .validateToken(token)
        .pipe(retry(2))
        .subscribe({
          next: (response: any) => {
            const { token, ...res } = response;

            // Almacenar el token
            this._tokenService.setToken(response.token);
            console.log('response', response);

            // Establecer el usuario actual en el estado
            this.store.dispatch(
              userActions.setCurrentUser({ currentUser: res })
            );

            // this._messageService.showError(
            //   'Correo o contraseña incorrectos. Por favor, intenta de nuevo.',
            //   'top right',
            //   5000,
            //   'Aceptar'
            // );
          },
          error: (err: any) => {
            // El token es inválido o ha expirado
            this._tokenService.removeToken();

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

  closeLeftDrawerFilters() {
    this.store.dispatch(
      toggleLeftSidebarFilters({ isOpen: !this.isLeftFilterSidebarOpen$ })
    );
  }

  closeRightDrawer() {
    this.store.dispatch(
      toggleRightSidebar({ isOpen: !this.isRightSidebarOpen$ })
    );
  }
}
