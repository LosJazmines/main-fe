import { createAction, props } from '@ngrx/store';
import { DeliveryInfo } from '../../models/order.model';

export const setDeliveryInfo = createAction(
  '[Order] Set Delivery Info',
  props<{ deliveryInfo: DeliveryInfo }>()
);

export const clearDeliveryInfo = createAction(
  '[Order] Clear Delivery Info'
);

export const validateDeliveryInfo = createAction(
  '[Order] Validate Delivery Info'
);

export const setOrderValidation = createAction(
  '[Order] Set Order Validation',
  props<{ isValid: boolean }>()
);

export const setDeliveryMethod = createAction(
  '[Order] Set Delivery Method',
  props<{ method: 'PICKUP' | 'DELIVERY' }>()
);

export const validateOrder = createAction(
  '[Order] Validate Order',
  props<{ isValid: boolean }>()
); 