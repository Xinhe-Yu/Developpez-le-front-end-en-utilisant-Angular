import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorMessageService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  showError(message: string) {
    this.errorSubject.next(message)
  }

  clearError() {
    this.errorSubject.next(null)
  }

  constructor() { }
}
