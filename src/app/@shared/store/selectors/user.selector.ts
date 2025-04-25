import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as UserState } from '../reducers/user.reducer';

const getUserFeatureState = createFeatureSelector<UserState>('currentUser');

export const selectCurrentUser = createSelector(getUserFeatureState, (state) =>
  state.currentUser ? state.currentUser : null
);

export const selectShoppingCart = createSelector(getUserFeatureState, (state) =>
  state.shoppingCart ? state.shoppingCart : null
);

export const getUserState = createSelector(
  getUserFeatureState,
  (state) => state
);

// Selector para obtener los roles del usuario actual
export const selectUserRoles = createSelector(
  selectCurrentUser,
  (user) => {
    if (!user) return [];
    // Handle both role and roles properties
    if (Array.isArray(user.roles)) {
      return user.roles;
    } else if (user.role) {
      return [user.role];
    }
    return [];
  }
);

// Selector para verificar si el usuario es ADMIN
export const selectIsAdmin = createSelector(selectUserRoles, (roles) =>
  roles.includes('ADMIN')
);
