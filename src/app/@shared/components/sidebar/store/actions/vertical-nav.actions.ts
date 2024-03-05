
/* NgRx */

// vertical-nav.actions.ts
import { createAction, props } from '@ngrx/store';


export const toggleVerticalNav = createAction(
    '[Vertical Nav] Toggle Vertical Nav',
    props<{ isOpen: boolean }>() // Definir propiedades adicionales, en este caso, isOpen
  );