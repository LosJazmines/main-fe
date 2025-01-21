import { createAction, props } from '@ngrx/store';

// Acción para abrir o cerrar el sidebar izquierdo
export const toggleLeftSidebar = createAction(
  '[Left Sidebar] Toggle Left Sidebar',
  props<{ isOpen: boolean }>()
);