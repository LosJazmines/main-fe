import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { Dialog } from '@angular/cdk/dialog';
import LoginComponent from '../../../pages/forms/login/login.component';
import { LucideModule } from '../../../../@shared/lucide/lucide.module';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../@shared/store/reducers';
import { toggleLeftSidebar } from '../../../../@shared/components/sidebars/left-sidebar/store/actions/left-sidebar.actions';
import { TokenService } from '../../../../@core/services/token.service';
import { MessageService } from '../../../../@core/services/snackbar.service';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../../@shared/store/reducers/user.reducer';
import {
  selectCurrentUser,
  selectIsAdmin,
  selectUserRoles,
} from '../../../../@shared/store/selectors/user.selector';
import { toggleRightSidebar } from '../../../../@shared/components/sidebars/right-sidebar/store/actions/right-sidebar.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser = signal<any>('');
  isAdmin$!: Observable<boolean>;
  userRoles$!: Observable<string[]>;

  private _unsuscribeAll!: Subscription;

  constructor(
    private _tokenService: TokenService,
    private _messageService: MessageService,
    public dialog: Dialog,
    private store: Store<AppState>
  ) {}
  ngOnInit(): void {
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
        }
      });
  }

  openLeftDrawer() {
    this.store.dispatch(toggleLeftSidebar({ isOpen: true }));
  }

  openRightDrawer() {
    this.store.dispatch(toggleRightSidebar({ isOpen: true }));
  }

  openDialogLogin(): void {
    const dialogRef = this.dialog.open<string>(LoginComponent, {
      width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
