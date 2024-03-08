import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Dashboard');
  }
}
