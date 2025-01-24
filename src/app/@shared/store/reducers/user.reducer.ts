import { createReducer, on } from '@ngrx/store';
import * as userActions from '../actions/user.actions';

export interface UserState {
  currentUser: any;
  shoppingCart: any[];
}

const initialState: UserState = {
  currentUser: '',
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

  /* Set Active Products*/
  on(userActions.shoppingCart, (state, action): any => {
    let shoppingCart = [...action.products];
    return {
      ...state,
      shoppingCart: shoppingCart,
    };
  }),

  on(userActions.clearShoppingCart, (state): any => {
    return {
      ...state,
      shoppingCart: [],
    };
  })
);
