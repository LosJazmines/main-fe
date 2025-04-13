import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminHeaderStore {
  private headerTitle = new BehaviorSubject<string>('');
  headerTitle$ = this.headerTitle.asObservable();

  updateHeaderTitle(title: string) {
    this.headerTitle.next(title);
  }
} 