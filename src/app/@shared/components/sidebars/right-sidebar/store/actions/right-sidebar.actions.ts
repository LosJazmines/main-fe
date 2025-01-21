import { createAction, props } from '@ngrx/store';

// Acción para abrir o cerrar el sidebar derecho
export const toggleRightSidebar = createAction(
  '[Right Sidebar] Toggle Right Sidebar',
  props<{ isOpen: boolean }>()
);
