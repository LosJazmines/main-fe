import { createReducer, on } from '@ngrx/store';
import { toggleLeftSidebarAdmin } from '../actions/left-sidebar-admin.actions';

// Definir el estado inicial
export interface LeftSidebarAdminState {
  isOpen: boolean;
}

const initialState: LeftSidebarAdminState = {
  isOpen: false, // Sidebar cerrado inicialmente
};

export const leftSidebarAdminReducer = createReducer(
  initialState,
  on(toggleLeftSidebarAdmin, (state, { isOpen }) => ({
    ...state,
    isOpen: isOpen, // Cambiar el estado de apertura según la acción
  }))
);
