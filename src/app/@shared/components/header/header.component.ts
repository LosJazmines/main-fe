import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { Dialog } from '@angular/cdk/dialog';
import LoginComponent from '../../../@public/pages/forms/login/login.component';
import { LucideModule } from '../../lucide/lucide.module';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { toggleLeftSidebar } from '../sidebars/left-sidebar/store/actions/left-sidebar.actions';
import { TokenService } from '../../../@core/services/token.service';
import { MessageService } from '../../../@core/services/snackbar.service';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../store/reducers/user.reducer';
import {
  selectCurrentUser,
  selectIsAdmin,
  selectShoppingCart,
  selectUserRoles,
} from '../../store/selectors/user.selector';
import { toggleRightSidebar } from '../sidebars/right-sidebar/store/actions/right-sidebar.actions';
import { AuthComponent } from '@public-pages/forms/auth/auth.component';
import { LogoComponent } from '../logo/logo.component';
import { Animations } from '@shared/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MaterialModule, LucideModule, CommonModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [Animations],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser = signal<any>('');
  shoppingCart = signal<any>(null);

  isAdmin$!: Observable<boolean>;
  userRoles$!: Observable<string[]>;
  shoppingCartLength = signal<number | null>(null);

  private _unsuscribeAll!: Subscription;

  scrolled = false; // Controla el estado del header

  constructor(
    private _tokenService: TokenService,
    private _messageService: MessageService,
    public dialog: Dialog,
    private store: Store<AppState>
  ) { }
  ngOnInit(): void {
    this.getUser();
    this.getShoppingCart();

  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
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
          console.log({ currentUser });

          this.isAdmin$ = this.store.select(selectIsAdmin);
        }
      });
  }

  getShoppingCart() {
    this._unsuscribeAll = this.store
      .select(selectShoppingCart)
      .subscribe((shoppingCart) => {
        if (shoppingCart) {
          this.shoppingCartLength.set(shoppingCart.length);
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
    const dialogRef = this.dialog.open<string>(AuthComponent, {
      width: '250px',
      data: { name: 'hola', animal: 'hola' },
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
