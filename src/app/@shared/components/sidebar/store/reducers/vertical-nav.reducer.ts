// sidebar.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { toggleVerticalNav } from '../actions/vertical-nav.actions';

export interface IVerticalNavState {
  isOpen: boolean;
}

const initialState: IVerticalNavState = {
  isOpen: true, // Vertical Nav inicialmente abierto
};

export const verticalNavReducer = createReducer(
  initialState,
  on(toggleVerticalNav, (state) => ({
    ...state,
    isOpen: !state.isOpen, // Invierte el valor actual
  }))
);