import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export default class ProductComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Products - Product');
  }
}
