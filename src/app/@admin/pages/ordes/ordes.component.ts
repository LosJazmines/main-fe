import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { Apollo } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ordes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ordes.component.html',
  styleUrl: './ordes.component.scss',
})
export default class OrdesComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Orders');

    this.getOrdes();
  }

  getOrdes() {
    console.log('hola');
  }
}
