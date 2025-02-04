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

  /* Set Active Products*/
  on(userActions.setShoppingCart, (state, action): any => {
    console.log({ action , state});
    
    return {
      ...state,
      shoppingCart: [...state.shoppingCart, ...action.products],
    };
  }),

  on(userActions.clearShoppingCart, (state): any => {
    return {
      ...state,
      shoppingCart: [],
    };
  })
);
