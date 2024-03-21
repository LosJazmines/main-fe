import { Component, Input, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchModernoReactiveModule } from '../search-moderno-reactive/search-moderno-reactive.module';
import { UserStore } from '../../../../@core/store/user.store';
import { SidebarStore } from '../../../../@core/store/sidebar.store';
import { AdminHeaderStore } from '../../../../@core/store/admin-header.store';

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
  currentUser = inject(UserStore);
  private _sidebarStore = inject(SidebarStore);
  public toggleSidebar$ = this._sidebarStore.getToggleSidebar();

  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  @Input() titleHeader!: string;

  isPanelToggle = true;

  showResetButton = false;

  searchForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this._formBuilder.group({
      search: [''],
    });
  }
  addCurrentUser(currentUser: any) {
    this.currentUser.addcurrentUser(currentUser);
  }

  panelToggle() {
    this._sidebarStore.updateToggleSidebar(!this.toggleSidebar$());

    return (this.isPanelToggle = !this.isPanelToggle);
  }

  search() {
    console.log('Seach click');
  }

  onSubmit() {}

  onClearSearch() {}

  handleSearch(event: any) {}

  openNoti() {}
}
