import { createSelector } from '@ngrx/store';
import { AppState } from '../index';
import { createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/user.reducer';

export const selectOrderState = (state: AppState) => state.order;

const getUserFeatureState = createFeatureSelector<State>('currentUser');

export const selectDeliveryInfo = createSelector(
  selectOrderState,
  (state) => state?.deliveryInfo ?? null
);

export const selectDeliveryMethod = createSelector(
  selectOrderState,
  (state) => state?.deliveryMethod ?? 'DELIVERY'
);

export const selectOrderValid = createSelector(
  selectOrderState,
  (state) => state?.isValid ?? false
);

export const selectCanCreateOrder = createSelector(
  selectOrderState,
  selectOrderValid,
  selectDeliveryMethod,
  (state, isValid, deliveryMethod) => {
    if (!state) return false;
    
    if (deliveryMethod === 'PICKUP') {
      return isValid;
    }
    
    return isValid && state.deliveryInfo !== null;
  }
); 