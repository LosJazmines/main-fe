import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LeftSidebarAdminState } from '../reducers/left-sidebar-admin.reducer';

// Crear un feature selector para obtener el estado del Left Sidebar
export const selectLeftSidebarAdminState =
  createFeatureSelector<LeftSidebarAdminState>('leftSidebarAdmin');

// Selector para obtener si el Left Sidebar está abierto o cerrado
export const selectIsLeftSidebarAdminOpen = createSelector(
  selectLeftSidebarAdminState,
  (state: LeftSidebarAdminState) => state.isOpen
);
