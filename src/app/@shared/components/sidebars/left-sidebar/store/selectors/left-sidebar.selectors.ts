import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LeftSidebarState } from '../reducers/left-sidebar.reducer';

// Crear un feature selector para obtener el estado del Left Sidebar
export const selectLeftSidebarState = createFeatureSelector<LeftSidebarState>('leftSidebar');

// Selector para obtener si el Left Sidebar está abierto o cerrado
export const selectIsLeftSidebarOpen = createSelector(
  selectLeftSidebarState,
  (state: LeftSidebarState) => state.isOpen
);