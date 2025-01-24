import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

const getUserFeatureState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  getUserFeatureState,
  (state) => state.currentUser
);

export const selectUserRoles = createSelector(
  selectCurrentUser,
  (user) => user?.roles || []
);

export const selectIsAdmin = createSelector(
  selectUserRoles,
  (roles) => roles.includes('ADMIN')
);
