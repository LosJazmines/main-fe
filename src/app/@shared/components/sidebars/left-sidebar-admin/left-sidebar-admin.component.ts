import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './left-sidebar-admin.component.html',
  styleUrls: ['./left-sidebar-admin.component.scss'],
})
export class LeftSidebarAdminComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}
}
