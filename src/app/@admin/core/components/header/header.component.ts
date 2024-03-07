import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchModernoReactiveModule } from '../search-moderno-reactive/search-moderno-reactive.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    SearchModernoReactiveModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isPanelToggle = true;

  showResetButton = false;

  searchForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      search: [''],
    });
  }

  panelToggle() {
    return (this.isPanelToggle = !this.isPanelToggle);
  }

  search() {
    console.log('Seach click');
  }

  onSubmit() {}

  onClearSearch() {}

  handleSearch(event: any) {}
}
