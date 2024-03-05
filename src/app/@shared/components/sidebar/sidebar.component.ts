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

import { IVerticalNavState } from './store/reducers/vertical-nav.reducer';
import { toggleVerticalNav } from './store/actions/vertical-nav.actions';
// import { getActiveEvent } from '../../store/reducers/user.reducer';
// import { Event } from '../../interfaces/event.interface';
// import { EventService } from '../../services/event.service';
// import { Producer } from '../../interfaces/producer.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [Animations],
})
export class SidebarComponent implements OnInit, OnDestroy {
  // Header
  @Input() isHiddenHeader!: boolean;
  @Input() headerIcon?: string;
  @Input() headerTitle?: string;
  @Input() headerRoute?: any;

  // Sub Header
  @Input() isHiddenSubHeader!: boolean;
  @Input() subHeaderIcon?: string;
  @Input() subHeaderRoute?: string[];
  @Input() subHeaderTitle?: string;

  @Input() isHiddenItems!: boolean;
  @Input() navData!: any[];

  @Input() page!: string;
  @Input() activeProducer!: any;

  producers!: any[];
  myBoolean!: boolean;
  collapsed: boolean = true;
  openOrClose: boolean = false;
  showDropdown!: boolean;
  screenWidth: number = 0;

  isSelectProducer!: boolean;

  unsuscribeAll!: Subscription;
  eventSubcribe!: Subscription;

  event!: Event;

  constructor(
    // private store: Store<{ verticalNav: IVerticalNavState }>,
    // private _eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subVerticalNav();
    // this.getActiveEvent();
    console.log(this.activeProducer);
  }

  ngOnDestroy(): void {
    this.unsuscribeAll?.unsubscribe();
    this.eventSubcribe?.unsubscribe();
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
    //   return this.store.dispatch(toggleVerticalNav({ isOpen: false }));
  }

  // getActiveEvent() {
  //   this.eventSubcribe = this.store
  //     .select(getActiveEvent)
  //     .subscribe((event: any) => {
  //       if (event) {
  //         this.event = event;
  //       }
  //     });
}

// publish() {
//   this._eventService.publish(this.event.id).subscribe((response) => {
//     console.log(response);
//   });
// }

// switchDropdown() {
//   this.showDropdown = !this.showDropdown;
// }

// // goToProducer(producer: Producer) {
// //   this.router.navigate(['/o', producer.producer.id, 'dashboard']);
// //   this.showDropdown = false;
// //   this.activeProducer = producer;
// // }

// switchSelectProducer() {
//   this.isSelectProducer = !this.isSelectProducer;
// }
//}
