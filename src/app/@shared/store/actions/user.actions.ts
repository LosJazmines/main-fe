import { createAction, props } from '@ngrx/store';

export const setCurrentUser = createAction(
  '[User] Set Current User',
  props<{ currentUser: any }>()
);

export const clearCurrentUser = createAction('[Auth] Clear Current User');

export const setShoppingCart = createAction(
  '[User] Set Shopping Cart',
  props<{ products: any }>()
);

export const clearShoppingCart = createAction('[User] Clear Shopping Cart');

export const removeFromCart = createAction(
  '[User] Remove From Cart',
  props<{ productId: string }>()
);

export const increaseQuantity = createAction(
  '[User] Increase Quantity',
  props<{ productId: string }>()
);

export const decreaseQuantity = createAction(
  '[User] Decrease Quantity',
  props<{ productId: string }>()
);
