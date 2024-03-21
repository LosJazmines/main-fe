import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading: boolean = false;

  private __loadingBehaviorSub: BehaviorSubject<boolean>;

  public _loading$: Observable<boolean>;

  constructor() {
    this.__loadingBehaviorSub = new BehaviorSubject<boolean>(this._loading)
    this._loading$ = this.__loadingBehaviorSub.asObservable();
  }

  show() {
    this._loading = true;
    return this.__loadingBehaviorSub.next(this._loading);
  }


  hide() {
    this._loading = false;
    return this.__loadingBehaviorSub.next(this._loading);
  }

}
