import { createReducer, on } from '@ngrx/store';
import { toggleLeftSidebar } from '../actions/left-sidebar.actions';

// Definir el estado inicial
export interface LeftSidebarState {
  isOpen: boolean;
}

const initialState: LeftSidebarState = {
  isOpen: false, // Sidebar cerrado inicialmente
};

export const leftSidebarReducer = createReducer(
  initialState,
  on(toggleLeftSidebar, (state, { isOpen }) => ({
    ...state,
    isOpen: isOpen, // Cambiar el estado de apertura según la acción
  }))
);