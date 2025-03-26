import { createReducer, on } from '@ngrx/store';
import { toggleLeftSidebarFilters } from '../actions/left-sidebar-filters.actions';

// Definir el estado inicial
export interface LeftSidebarFiltersState {
  isOpen: boolean;
}

const initialState: LeftSidebarFiltersState = {
  isOpen: false, // Sidebar cerrado inicialmente
};

export const leftSidebarFilterReducer = createReducer(
  initialState,
  on(toggleLeftSidebarFilters, (state, { isOpen }) => ({
    ...state,
    isOpen: isOpen, // Cambiar el estado de apertura según la acción
  }))
);
