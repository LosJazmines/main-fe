import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

const getUserFeatureState = createFeatureSelector<UserState>('currentUser');

export const selectCurrentUser = createSelector(getUserFeatureState, (state) =>
  state.currentUser ? state.currentUser : null
);

export const getUserState = createSelector(
  getUserFeatureState,
  (state) => state
);

// Selector para obtener los roles del usuario actual
export const selectUserRoles = createSelector(
  selectCurrentUser,
  (user) => user?.roles || []
);

// Selector para verificar si el usuario es ADMIN
export const selectIsAdmin = createSelector(selectUserRoles, (roles) =>
  roles.includes('ADMIN')
);
