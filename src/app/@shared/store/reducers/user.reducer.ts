import { createReducer, on } from '@ngrx/store';
import * as userActions from '../actions/user.actions';

export interface UserState {
  currentUser: any;
  shoppingCart: any[];
}

// Función segura para obtener el carrito desde localStorage
const getShoppingCartFromStorage = (): any[] => {
  if (typeof window !== 'undefined' && localStorage.getItem('shoppingCart')) {
    return JSON.parse(localStorage.getItem('shoppingCart') || '[]');
  }
  return [];
};

const initialState: UserState = {
  currentUser: null,
  shoppingCart: getShoppingCartFromStorage(), // 🔥 Recuperamos el carrito de forma segura
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
    const product = Array.isArray(products) ? products[0] : products;

    if (!product || typeof product !== 'object') {
      console.error('Producto inválido recibido en setShoppingCart:', products);
      return state;
    }

    const existingProductIndex = state.shoppingCart.findIndex(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProductIndex !== -1) {
      updatedCart = state.shoppingCart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      const cleanProduct = { ...product, quantity: 1 };
      updatedCart = [...state.shoppingCart, cleanProduct];
    }

    // 🔥 GUARDAMOS EL CARRITO EN LOCALSTORAGE SOLO EN CLIENTE
    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    }

    return {
      ...state,
      shoppingCart: updatedCart,
    };
  }),

  // Incrementar cantidad
  on(userActions.increaseQuantity, (state, { productId }) => {
    const updatedCart = state.shoppingCart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    }

    return { ...state, shoppingCart: updatedCart };
  }),

  // Decrementar cantidad
  on(userActions.decreaseQuantity, (state, { productId }) => {
    const updatedCart = state.shoppingCart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    }

    return { ...state, shoppingCart: updatedCart };
  }),

  on(userActions.removeFromCart, (state, { productId }) => {
    const updatedCart = state.shoppingCart.filter((item) => item.id !== productId);

    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
    }

    return { ...state, shoppingCart: updatedCart };
  }),

  on(userActions.clearShoppingCart, (state) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shoppingCart');
    }

    return { ...state, shoppingCart: [] };
  })
);
