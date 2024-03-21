import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, delay, filter, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenService {
  private _loading: boolean = true;

  private __loadingBehaviorSub: BehaviorSubject<boolean>;

  public _loading$: Observable<boolean>;

  /**
   * Constructor
   */
  constructor(private _router: Router) {
    // // Hide it on the first NavigationEnd event

    this.__loadingBehaviorSub = new BehaviorSubject<boolean>(this._loading);
    this._loading$ = this.__loadingBehaviorSub.asObservable();

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        return this.hide();
      });
  }

  //TODO:Los delay hay que sacarlo cuando se conecten todos los servicios necesarios en el resolver inicial.

  simulateProcess(): Observable<any> {
    // Simulamos un proceso con un retardo de 2 segundos
    return of(true).pipe(delay(2000));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the splash screen
   */
  show(): void {
    this._loading = true;
    return this.__loadingBehaviorSub.next(this._loading);
  }

  /**
   * Hide the splash screen
   */
  hide(): void {
    this._loading = false;
    return this.__loadingBehaviorSub.next(this._loading);
  }
}
