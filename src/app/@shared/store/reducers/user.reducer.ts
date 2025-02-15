import { createReducer, on } from '@ngrx/store';
import * as userActions from '../actions/user.actions';

export interface UserState {
  currentUser: any;
  shoppingCart: any[];
}

const initialState: UserState = {
  currentUser: null,
  shoppingCart: [],
};

export const userReducer = createReducer(
  initialState,

  /* Set Current User */
  on(userActions.setCurrentUser, (state, action): UserState => {
    return {
      ...state,
      currentUser: action.currentUser,
    };
  }),

  on(userActions.clearCurrentUser, (state) => ({
    ...state,
    currentUser: null,
  })),

  /* Agregar producto al carrito sin duplicados */
  on(userActions.setShoppingCart, (state, { products }) => {
    const existingProductIndex = state.shoppingCart.findIndex(
      (item) => item.id === products.id
    );

    let updatedCart;

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, aumentamos la cantidad
      updatedCart = state.shoppingCart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      // Si el producto no existe, lo agregamos con cantidad 1
      updatedCart = [...state.shoppingCart, { ...products, quantity: 1 }];
    }

    return {
      ...state,
      shoppingCart: updatedCart,
    };
  }),

  // Incrementar cantidad
  on(userActions.increaseQuantity, (state, { productId }) => ({
    ...state,
    shoppingCart: state.shoppingCart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ),
  })),

  // Decrementar cantidad
  on(userActions.decreaseQuantity, (state, { productId }) => ({
    ...state,
    shoppingCart: state.shoppingCart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ),
  })),

  on(userActions.removeFromCart, (state, { productId }) => ({
    ...state,
    shoppingCart: state.shoppingCart.filter((item) => item.id !== productId),
  })),

  on(userActions.clearShoppingCart, (state): any => {
    return {
      ...state,
      shoppingCart: [],
    };
  })
);
