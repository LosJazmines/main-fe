import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../@shared/components/sidebar/sidebar.component';
import { navbar_admin } from './nav-data';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MenuComponent } from '@shared/components/sidebars/left-sidebar/menu/menu.component';
import { Observable, Subscription } from 'rxjs';
import { MenuItem } from '@core/interfaces/menu_sidebar';
import { AppState } from '@shared/store';
import { Store } from '@ngrx/store';
import { TokenService } from '@core/services/token.service';
import { selectCurrentUser, selectIsAdmin } from '@shared/store/selectors/user.selector';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, MenuComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export default class AdminComponent implements OnInit, OnDestroy {
  // @ViewChild('menuButton') menuButton: any;
  private _unsuscribeAll!: Subscription;

  isAdmin$!: Observable<boolean>;
  userRoles$!: Observable<string[]>;

  // Suponiendo que obtienes el rol del usuario de algún servicio
  userRole: string = 'admin'; // o 'admin'

  menuItems!: MenuItem[];



  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _tokenService: TokenService
  ) { }



  ngOnInit() {
    // this.getUser();
    this.menuItems = [...navbar_admin];

  }


  ngOnDestroy(): void {
    // this._unsuscribeAll.unsubscribe();
  }

  getUser() {
    // this._unsuscribeAll = this.store
    //   .select(selectCurrentUser)
    //   .subscribe((currentUser) => {
    //     if (currentUser) {
    //       // this.currentUser.set(currentUser);
    //       this.isAdmin$ = this.store.select(selectIsAdmin);
    //       console.log(this.isAdmin$);

    //       if (this.isAdmin$) {
    //         this.menuItems = [...this.menuItems, ...navbar_admin];
    //       }
    //       // this.closeRightDrawer();
    //     }
    //   });
  }
  closeLeftDrawer(event: Event) {
    // this.store.dispatch(toggleLeftSidebar({ isOpen: false }));
    // (event.target as HTMLElement).blur();
  }
}
