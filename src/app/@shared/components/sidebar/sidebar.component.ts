import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
// import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Animations } from '../../animations';

// import { IVerticalNavState } from './store/reducers/vertical-nav.reducer';
// import { toggleVerticalNav } from './store/actions/vertical-nav.actions';
// import { getActiveEvent } from '../../store/reducers/user.reducer';
// import { Event } from '../../interfaces/event.interface';
// import { EventService } from '../../services/event.service';
// import { Producer } from '../../interfaces/producer.interface';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [Animations],
})
export class SidebarComponent implements OnInit, OnDestroy {
  // Header
  @Input() isHiddenHeader!: boolean;
  @Input() headerIcon!: string;
  @Input() headerTitle!: string;
  @Input() headerRoute!: string[];

  // Sub Header
  @Input() isHiddenSubHeader!: boolean;
  @Input() subHeaderIcon!: string;
  @Input() subHeaderRoute!: string[];
  @Input() subHeaderTitle!: string;

  @Input() isHiddenItems!: boolean;
  @Input() navData!: any[];

  myBoolean!: boolean;
  collapsed: boolean = true;
  openOrClose: boolean = false;

  screenWidth: number = 0;

  unsuscribeAll!: Subscription;

  // constructor(private store: Store<{ verticalNav: IVerticalNavState }>) {}

  ngOnInit() {
    this.subVerticalNav();
  }

  ngOnDestroy(): void {
    // this.unsuscribeAll.unsubscribe();
  }

  subVerticalNav() {
    // this.unsuscribeAll = this.store
    //   .select((state) => state.verticalNav.isOpen)
    //   .subscribe((isOpen) => {
    //     this.myBoolean = isOpen;
    //     this.onResize();
    //   });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;

    switch (true) {
      case this.screenWidth <= 768:
        this.collapsed = true;
        this.openOrClose = this.myBoolean;
        break;

      case this.screenWidth < 1024:
        this.openOrClose = this.myBoolean;
        this.collapsed = true;
        break;

      case this.screenWidth < 1440:
        this.openOrClose = false;
        this.collapsed = this.myBoolean;
        break;

      case this.screenWidth >= 1440:
        this.openOrClose = false;
        this.collapsed = true;
        break;

      default:
        break;
    }
  }

  closeSidebarMobile() {
    // if (this.screenWidth < 1024)
    // return this.store.dispatch(toggleVerticalNav({ isOpen: false }));
  }
}
