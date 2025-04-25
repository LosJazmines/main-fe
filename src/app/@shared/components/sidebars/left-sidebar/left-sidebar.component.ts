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
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideModule } from '../../../lucide/lucide.module';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { Animations } from '@shared/animations';
import { toggleLeftSidebar } from './store/actions/left-sidebar.actions';
import { MenuComponent } from './menu/menu.component';
import { MenuItem } from '@core/interfaces/menu_sidebar';
import { navbar_admin } from '@admin-pages/nav-data';
import { AppState } from '@shared/store';
import { TokenService } from '@core/services/token.service';
import { Observable, Subscription } from 'rxjs';
import { selectCurrentUser, selectIsAdmin } from '@shared/store/selectors/user.selector';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, LucideModule, LogoComponent, MenuComponent],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss'],
  animations: [Animations],
})
export class LeftSidebarComponent implements OnInit, OnDestroy {
  @ViewChild('menuButton') menuButton: any;
  private _unsuscribeAll!: Subscription;

  isAdmin$!: Observable<boolean>;
  userRoles$!: Observable<string[]>;

  // Suponiendo que obtienes el rol del usuario de algún servicio
  userRole: string = 'admin'; // o 'admin'

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'home',
      route: '/home'
    },
    {
      label: 'Tienda',
      icon: 'store',
      route: '/online-store'
    },
    // // Puedes agregar más items y restringirlos con roles
    // {
    //   label: 'Panel Admin',
    //   icon: 'settings',
    //   route: '/admin',
    //   roles: ['admin']
    // }
  ];

  // menuItemsAdmin: MenuItem[] = [
  //   {
  //     label: 'Inicio',
  //     icon: 'home',
  //     route: '/home'
  //   },
  //   {
  //     label: 'Tienda',
  //     icon: 'store',
  //     route: '/online-store'
  //   },
  //   // Puedes agregar más items y restringirlos con roles
  //   {
  //     label: 'Panel Admin',
  //     icon: 'settings',
  //     route: '/admin',
  //     roles: ['admin']
  //   }
  // ];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _tokenService: TokenService
  ) { }



  ngOnInit() {
    if (this.menuButton) {
      this.menuButton.nativeElement.blur();
    }
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
          // this.currentUser.set(currentUser);
          this.isAdmin$ = this.store.select(selectIsAdmin);
          console.log(this.isAdmin$);

          if (this.isAdmin$) {
            this.menuItems = [...this.menuItems, ...navbar_admin];
          }
          // this.closeRightDrawer();
        }
      });
  }
  closeLeftDrawer(event: Event) {
    this.store.dispatch(toggleLeftSidebar({ isOpen: false }));
    (event.target as HTMLElement).blur();
  }
}
