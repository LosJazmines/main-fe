import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchModernoReactiveComponent } from './search-moderno-reactive.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../@shared/material/material.module';

@NgModule({
  declarations: [SearchModernoReactiveComponent],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [SearchModernoReactiveComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SearchModernoReactiveModule {}
