import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-user',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss',
})
export class CardUserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
