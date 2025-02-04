import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RightSidebarState } from '../reducers/right-sidebar.reducer';

// Crear un feature selector para obtener el estado del Right Sidebar
export const selectRightSidebarState = createFeatureSelector<RightSidebarState>('rightSidebar');

// Selector para obtener si el Right Sidebar está abierto o cerrado
export const selectIsRightSidebarOpen = createSelector(
  selectRightSidebarState,
  (state: RightSidebarState) => state.isOpen
);