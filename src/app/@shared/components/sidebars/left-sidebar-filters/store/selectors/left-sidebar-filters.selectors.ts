import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LeftSidebarFiltersState } from '../reducers/left-sidebar-filters.reducer';

// Crear un feature selector para obtener el estado del Left Sidebar
export const selectLeftSidebarFiltersState =
  createFeatureSelector<LeftSidebarFiltersState>('leftSidebarFilters');

// Selector para obtener si el Left Sidebar está abierto o cerrado
export const selectIsLeftSidebarFiltersOpen = createSelector(
  selectLeftSidebarFiltersState,
  (state: LeftSidebarFiltersState) => state.isOpen
);
