import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { CdkStepper } from '@angular/cdk/stepper';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription } from 'rxjs';

import * as stepperActions from '../../store/actions/stepper.actions';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { LucideModule } from '../../lucide/lucide.module';
import { PipesModule } from '../../../@core/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IStepperState } from '../../store/reducers/stepper.reducer';

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  imports: [
    CommonModule,
    LucideModule,
    PipesModule,
    MaterialModule,
    FormsModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
})
export class StepperComponent
  extends CdkStepper
  implements OnInit, OnDestroy, AfterViewInit
{
  progress!: number;

  @Input() nameInput: any;

  private _unsuscribeAll!: Subscription;

  stepperSelector = createFeatureSelector<IStepperState>('stepper');

  constructor(
    private store: Store<IStepperState>,
    _dir: Directionality,
    private _changeDetectorRef2: ChangeDetectorRef,

    _changeDetectorRef: ChangeDetectorRef,
    _elementRef: ElementRef<HTMLElement>
  ) {
    super(_dir, _changeDetectorRef, _elementRef);
  }

  ngOnInit(): void {
    this.progress = 0;

    /*     this.subcriptionBackStepAndNextStep(); */
  }

  override ngOnDestroy() {
    this._unsuscribeAll.unsubscribe();
  }

  /*   public subcriptionBackStepAndNextStep() {
    this._unsuscribeAll = this.store
      .select(this.stepperSelector)
      .subscribe((state) => {

        if (state.backStep) {
          this.backStep();
          this.store.dispatch(stepperActions.resetClicked());
        }
        if (state.nextStep) {
          this.nextStep();
          this.store.dispatch(stepperActions.resetClicked());
        }

        if (state.nextPayment) {
          this.nextPayment();
          this.store.dispatch(stepperActions.resetClicked());
        }
      });
  } */

  private backStep() {
    this.progress -= 50;

    const currentStep = this.steps.toArray()[this.selectedIndex];
    // Desmarca el paso actual si retrocedes
    currentStep.completed = false;
    this.previous();
  }

  private nextStep() {
    if (
      this.selected?.stepControl?.valid ||
      this.selected?.stepControl == undefined
    ) {
      this.progress += 50;

      this.next();

      this.markCurrentStepCompleted();
    }
  }

  private nextPayment() {
    // setTimeout(() => {
    //   this.nextStep();
    // }, 100);
  }

  private markCurrentStepCompleted() {
    const currentStep = this.steps.toArray()[this.selectedIndex];
    currentStep.completed = true;
    this._changeDetectorRef2.detectChanges();
  }
}
