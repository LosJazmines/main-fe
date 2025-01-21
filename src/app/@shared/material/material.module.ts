import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';

// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';

// import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// Cdk
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

// import { MomentDateAdapter } from '@angular/material-moment-adapter';

// Cdk
import { CdkTableModule } from '@angular/cdk/table';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { DialogModule } from '@angular/cdk/dialog';

export const MATERIAL_MODULES = [
  MatStepperModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  MatSortModule,
  MatFormFieldModule,
  MatSortModule,
  MatDialogModule,
  MatTableModule,
  MatSortModule,
  MatDividerModule,
  MatExpansionModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatButtonModule,
  MatRippleModule,
  MatCheckboxModule,
  MatRadioModule,
  TextFieldModule,
  MatInputModule,
  MatButtonToggleModule,
  // NgxMaterialTimepickerModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatPaginatorModule,
  MatTooltipModule,
  // CDK
  CdkStepperModule,
  CdkTableModule,
  DialogModule,
  CdkAccordionModule,
  MatBadgeModule,
  MatSidenavModule,
];

@NgModule({
  imports: [CommonModule, MATERIAL_MODULES],
  exports: [MATERIAL_MODULES],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE],
    // },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMMM Y',
        },
      },
    },
  ],
})
export class MaterialModule {}
