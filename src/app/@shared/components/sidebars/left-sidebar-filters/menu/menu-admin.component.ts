import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { toggleLeftSidebarAdmin } from '../store/actions/left-sidebar-admin.actions';
import { Animations } from '../../../../animations';
import { MaterialModule } from '../../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss',
  animations: [Animations],
})
export class MenuAdminComponent implements OnInit {
  @Input() page: any;
  @Input() navUser!: any;
  @Input() navbarAdmin!: any;

  // Bandera para verificar si los datos están listos
  isDataReady: boolean = false;

  constructor(private store: Store) {}

  ngOnInit() {}

  closeLeftDrawer() {
    this.store.dispatch(toggleLeftSidebarAdmin({ isOpen: false }));
  }
}
