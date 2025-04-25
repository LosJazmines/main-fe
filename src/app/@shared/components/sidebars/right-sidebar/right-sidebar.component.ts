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
import { AuthService } from '../../../../@apis/auth.service';
import { Animations } from '@shared/animations';
import { Inject } from '@angular/core';

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
    @Inject(AuthService) private _authService: AuthService
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
          console.log('currentUser', currentUser);
          this.currentUser.set(currentUser);
          
          // Get admin status
          this.isAdmin$ = this.store.select(selectIsAdmin);
          
          // Log admin status for debugging
          this.isAdmin$.subscribe(isAdmin => {
            console.log('User is admin:', isAdmin);
          });
          
          this.closeRightDrawer();
        }
      });
  }

  goToadmin() {
    this.router.navigate(['/a']);
    this.closeRightDrawer();
  }

  logout(): void {
    this._authService.logout();
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
