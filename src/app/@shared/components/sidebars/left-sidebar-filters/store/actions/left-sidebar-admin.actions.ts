import { createAction, props } from '@ngrx/store';

// Acción para abrir o cerrar el sidebar izquierdo
export const toggleLeftSidebarAdmin = createAction(
  '[Left Sidebar Admin] Toggle Left Sidebar Admin',
  props<{ isOpen: boolean }>()
);