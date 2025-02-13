import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageLoaderService {
  constructor() {}

  private loading$ = new BehaviorSubject(false);

  isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  showLoader() {
    this.loading$.next(true);
  }

  hideLoader() {
    this.loading$.next(false);
  }
}
