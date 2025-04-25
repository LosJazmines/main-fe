import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  TypeSnackBarPosition,
  TypeSnackBarPositionHorizontal,
  TypeSnackBarPositionVertical,
} from '../types/snackbar.types';

interface IPosition {
  horizontalPosition: TypeSnackBarPositionHorizontal;
  verticalPosition: TypeSnackBarPositionVertical;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  /**
   * Variables que le pasamos para definir deque color typo es el mensaje del
   */

  private SNACKBAR_TYPE_INFO = 1; // Informativo
  private SNACKBAR_TYPE_WARNING = 2; // Error Leve
  private SNACKBAR_TYPE_ERROR = 3; // Error servicio

  constructor(private _snackBar: MatSnackBar) {}

  /**
   * SnackBar Informativo
   * @param message     : mensaje que recibe
   * @param position    : posicion en que saldra
   * @param duration    : tiempo que prermanesera a la vista
   */

  showInfo(
    message: string,
    position: TypeSnackBarPosition,
    duration?: number,
    action?: string
  ): void {
    this.showSnackBar(
      message,
      position,
      this.SNACKBAR_TYPE_INFO,
      duration,
      action
    );
  }

  /**
   * SnackBar Informar error o accion
   * @param message     : mensaje que recibe
   * @param position    : posicion en que saldra
   * @param duration    : tiempo que prermanesera a la vista
   */

  showWarning(
    message: string,
    position: TypeSnackBarPosition,
    duration?: number,
    action?: string
  ): void {
    this.showSnackBar(
      message,
      position,
      this.SNACKBAR_TYPE_WARNING,
      duration,
      action
    );
  }

  /**
   * SnackBar Error
   * @param message     : mensaje que recibe
   * @param position    : posicion en que saldra
   * @param duration    : tiempo que prermanesera a la vista
   */
  showError(
    message: string,
    position: TypeSnackBarPosition,
    duration?: number,
    action?: string
  ): void {
    this.showSnackBar(
      message,
      position,
      this.SNACKBAR_TYPE_ERROR,
      duration,
      action
    );
  }

  /**
   * SnackBar Success
   * @param message     : mensaje que recibe
   * @param position    : posicion en que saldra
   * @param duration    : tiempo que prermanesera a la vista
   */
  showSuccess(
    message: string,
    position: TypeSnackBarPosition,
    duration?: number,
    action?: string
  ): void {
    this.showSnackBar(
      message,
      position,
      this.SNACKBAR_TYPE_INFO,
      duration,
      action
    );
  }

  /**
   * Funcion para cerrar SnackBar
   * de forma inmediata
   */
  closeSnackBar() {
    this._snackBar.dismiss();
  }

  /**
   *
   * @param message    : Mensaje que recibe
   * @param position   : Posicion en la que aparece
   * @param type       : Tipo de Mensaje
   * @param duration   : Duracion del mensaje
   */

  /**
   *  Funcion privada al que le enviariamos los datos
   * @param message
   * @param position
   * @param type
   * @param duration
   */
  private showSnackBar(
    message: string,
    position: TypeSnackBarPosition,
    type: number,
    duration?: number,
    action?: string
  ) {
    if (!duration) duration = 3000;

    const positionSnack = this.getPosition(position);

    this._snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: positionSnack.horizontalPosition,
      verticalPosition: positionSnack.verticalPosition,
      panelClass: this.getClassColor(type),
    });
  }

  /**
   * @param position Posicion que le mandamos para que se muestre en pantalla
   * @returns        Posicion en la que aparecera el SnackBar
   */

  private getPosition(position: TypeSnackBarPosition): IPosition {
    switch (position) {
      case 'bottom center':
        return { horizontalPosition: 'center', verticalPosition: 'bottom' };
      case 'bottom left':
        return { horizontalPosition: 'left', verticalPosition: 'bottom' };
      case 'bottom right':
        return { horizontalPosition: 'right', verticalPosition: 'bottom' };
      case 'top center':
        return { horizontalPosition: 'center', verticalPosition: 'top' };
      case 'top left':
        return { horizontalPosition: 'left', verticalPosition: 'top' };
      default:
        return { horizontalPosition: 'right', verticalPosition: 'top' };
    }
  }

  /**
   * @param type : tipo que le mandamos, de eso depende que color se mostrara
   * @returns
   */

  private getClassColor(type: number): string {
    switch (type) {
      case 2:
        return 'snackbar-warning';
      case 3:
        return 'snackbar-error';
      default:
        return 'snackbar-info';
    }
  }
}
