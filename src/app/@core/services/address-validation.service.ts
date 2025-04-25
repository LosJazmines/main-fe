import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressValidationService {
  validateDeliveryAddress(order: {
    metodoEnvio: string;
    direccion?: string;
    ciudad?: string;
    estado?: string;
    pais?: string;
  }): { isValid: boolean; message: string } {
    // Si es retiro en sucursal, no necesitamos validar la dirección
    if (order.metodoEnvio === 'PICKUP') {
      return { isValid: true, message: '' };
    }

    // Para entrega a domicilio, validamos que todos los campos de dirección estén presentes
    if (order.metodoEnvio === 'DELIVERY') {
      if (!order.direccion || order.direccion.trim() === '') {
        return { isValid: false, message: 'La dirección es requerida para entrega a domicilio' };
      }
      if (!order.ciudad || order.ciudad.trim() === '') {
        return { isValid: false, message: 'La ciudad es requerida para entrega a domicilio' };
      }
      if (!order.estado || order.estado.trim() === '') {
        return { isValid: false, message: 'El estado es requerido para entrega a domicilio' };
      }
      if (!order.pais || order.pais.trim() === '') {
        return { isValid: false, message: 'El país es requerido para entrega a domicilio' };
      }
      return { isValid: true, message: '' };
    }

    return { isValid: false, message: 'Método de envío no válido' };
  }
} 