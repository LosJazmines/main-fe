import { createAction, props } from '@ngrx/store';

// Acción para abrir o cerrar el sidebar izquierdo
export const toggleLeftSidebarFilters = createAction(
  '[Left Sidebar Filters] Toggle Left Sidebar Filters',
  props<{ isOpen: boolean }>()
);