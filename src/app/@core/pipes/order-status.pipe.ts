import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  transform(status: string): any {
    let translatedStatus = '';
    let colorClass = '';

    switch (status) {
      case 'paid':
        translatedStatus = 'Pagado';
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'pending':
        translatedStatus = 'Pendiente';
        colorClass = 'bg-orange-100 text-orange-800';
        break;
      case 'shipped':
        translatedStatus = 'Enviado';
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'completed':
        translatedStatus = 'Completado';
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'cancelled':
        translatedStatus = 'Cancelado';
        colorClass = 'bg-red-100 text-red-800';
        break;
      default:
        translatedStatus = 'Estado desconocido';
        colorClass = 'bg-gray-100 text-gray-800';
        break;
    }

    return { translatedStatus, colorClass };
  }
}
