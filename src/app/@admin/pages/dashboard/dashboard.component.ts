import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { DrawerComponent } from '../../../@shared/components/drawer/drawer.component';
import { drawerMode } from '../../../@shared/components/drawer/drawer.types';
import { CommonModule } from '@angular/common';
import { Animations } from '../../../@shared/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DrawerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [Animations],
})
export default class DashboardComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  drawerMode: drawerMode = 'over';
  drawerOpened: boolean = false;

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Dashboard');
  }

  /**
   * Toggle the drawer mode
   */
  toggleDrawerMode(): void {
    this.drawerMode = this.drawerMode === 'side' ? 'over' : 'side';
  }

  /**
   * Toggle the drawer open
   */
  toggleDrawerOpen(): void {
    console.log({ drawerOpened: this.drawerOpened });

    this.drawerOpened = !this.drawerOpened;
  }

  /**
   * Drawer opened changed
   *
   * @param opened
   */
  drawerOpenedChanged(opened: boolean): void {
    this.drawerOpened = opened;
  }
}
