/* NgRx */
import { createAction, props } from '@ngrx/store';

export const goStep = createAction(
  '[Step Payment] Back Step',
  props<{ step: string }>()
);
