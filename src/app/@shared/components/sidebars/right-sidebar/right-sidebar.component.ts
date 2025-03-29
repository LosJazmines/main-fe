import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideModule } from '../../../lucide/lucide.module';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, Subscription } from 'rxjs';
import {
  selectCurrentUser,
  selectIsAdmin,
} from '../../../store/selectors/user.selector';
import { toggleRightSidebar } from './store/actions/right-sidebar.actions';
import { selectIsRightSidebarOpen } from './store/selectors/right-sidebar.selectors';
import * as userActions from '../../../../@shared/store/actions/user.actions';
import { isNullableType } from 'graphql';
import { TokenService } from '../../../../@core/services/token.service';
import { Animations } from '@shared/animations';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, LucideModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  animations: [Animations],
})
export class RightSidebarComponent implements OnInit, OnDestroy {
  currentUser = signal<any>('');
  isAdmin$!: Observable<boolean>;
  userRoles$!: Observable<string[]>;
  isRightSidebarOpen$!: Observable<boolean>;

  private _unsuscribeAll!: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _tokenService: TokenService
  ) {
    this.isRightSidebarOpen$ = this.store.select(selectIsRightSidebarOpen);
  }

  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy(): void {
    this._unsuscribeAll.unsubscribe();
  }

  getUser() {
    this._unsuscribeAll = this.store
      .select(selectCurrentUser)
      .subscribe((currentUser) => {
        if (currentUser) {
          this.currentUser.set(currentUser);
          this.isAdmin$ = this.store.select(selectIsAdmin);
          this.closeRightDrawer();
        }
      });
  }

  goToadmin() {
    this.router.navigate(['/a']);
    this.closeRightDrawer();
  }

  logout(): void {
    // Disparar la acción de logout
    this.store.dispatch(userActions.clearCurrentUser());
    this._tokenService.removeToken();

    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
    this.closeRightDrawer();
  }

  closeRightDrawer() {
    this.store.dispatch(
      toggleRightSidebar({ isOpen: !this.isRightSidebarOpen$ })
    );
  }
}
