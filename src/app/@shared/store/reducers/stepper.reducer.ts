// sidebar.reducer.ts
import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as stepperActions from '../actions/stepper.actions';

export interface IStepperState {
  step: string;
}

const initialState: IStepperState = {
  step: 'products',
};

const stepperSelector = createFeatureSelector<IStepperState>('stepper');
export const getActiveStep = createSelector(
  stepperSelector,
  (state) => state
);


export const stepperReducer = createReducer(
  initialState,

  on(stepperActions.goStep, (state, action) => ({
    ...state,
    step: action.step,
  })),

)
