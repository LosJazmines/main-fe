import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Animations } from '@shared/animations';

@Component({
  selector: 'app-left-sidebar-filters',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './left-sidebar-filters.component.html',
  styleUrls: ['./left-sidebar-filters.component.scss'],
  animations: [Animations],
})
export class LeftSidebarFiltersComponent implements OnInit, OnDestroy {
  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void { }
}
