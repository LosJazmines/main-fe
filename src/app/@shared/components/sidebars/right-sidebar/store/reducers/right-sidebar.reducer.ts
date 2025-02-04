import { createReducer, on } from '@ngrx/store';
import { toggleRightSidebar } from '../actions/right-sidebar.actions';

// Definir el estado inicial
export interface RightSidebarState {
  isOpen: boolean;
}

const initialState: RightSidebarState = {
  isOpen: false, // Sidebar cerrado inicialmente
};

export const rightSidebarReducer = createReducer(
  initialState,
  on(toggleRightSidebar, (state, { isOpen }) => ({
    ...state,
    isOpen: isOpen, // Cambiar el estado de apertura según la acción
  }))
);