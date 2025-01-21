import { Component, Input, OnInit } from '@angular/core';
import { Animations } from '../../../../animations';
import { MaterialModule } from '../../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [Animations],
})
export class MenuComponent implements OnInit {
  @Input() page: any;
  isDataReady: boolean = false;

  constructor() {}

  ngOnInit() {}
}
