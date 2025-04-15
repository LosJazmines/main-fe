import { createReducer, on } from '@ngrx/store';
import * as OrderActions from '../actions/order.actions';
import { DeliveryInfo } from '../../models/order.model';

export interface OrderState {
  deliveryMethod: 'PICKUP' | 'DELIVERY';
  deliveryInfo: DeliveryInfo | null;
  isValid: boolean;
}

export const initialState: OrderState = {
  deliveryMethod: 'DELIVERY',
  deliveryInfo: null,
  isValid: false
};

export const orderReducer = createReducer(
  initialState,
  
  on(OrderActions.setDeliveryMethod, (state, { method }) => ({
    ...state,
    deliveryMethod: method,
    // Si es PICKUP, establecemos la información de la sucursal
    ...(method === 'PICKUP' ? {
      deliveryInfo: {
        direccion: 'Avenida España 995, Tandil, Buenos Aires',
        ciudad: 'Tandil',
        estado: 'Buenos Aires',
        pais: 'Argentina',
        codigoPostal: '7000',
        telefonoMovil: '',
        nombre: '',
        metodoEnvio: method
      },
      isValid: true
    } : {
      deliveryInfo: null,
      isValid: false
    })
  })),

  on(OrderActions.setDeliveryInfo, (state, { deliveryInfo }) => ({
    ...state,
    deliveryInfo
  })),

  on(OrderActions.validateOrder, (state, { isValid }) => ({
    ...state,
    isValid
  }))
); 