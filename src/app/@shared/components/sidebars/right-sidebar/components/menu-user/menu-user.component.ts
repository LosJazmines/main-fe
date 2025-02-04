import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { MaterialModule } from '../../../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-user',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './menu-user.component.html',
  styleUrl: './menu-user.component.scss',
})
export class MenuUserComponent implements OnInit, OnDestroy {
  constructor() {}
  ngOnInit(): void {}

  ngOnDestroy() {}
}
