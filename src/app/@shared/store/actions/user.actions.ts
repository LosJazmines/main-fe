import { createAction, props } from '@ngrx/store';

export const setCurrentUser = createAction(
  '[User] Set Current User',
  props<{ currentUser: any }>()
);

export const clearCurrentUser = createAction('[Auth] Clear Current User');

export const shoppingCart = createAction(
  '[User] Set Shopping Cart',
  props<{ products: any[] }>()
);

export const clearShoppingCart = createAction('[User] Clear Shopping Cart');
