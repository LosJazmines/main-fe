import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';

@Component({
  selector: 'app-ordes',
  standalone: true,
  imports: [],
  templateUrl: './ordes.component.html',
  styleUrl: './ordes.component.scss',
})
export default class OrdesComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Orders');
  }
}
