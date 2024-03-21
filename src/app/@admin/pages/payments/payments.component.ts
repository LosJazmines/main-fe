import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export default class PaymentsComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Payments');
  }
}
