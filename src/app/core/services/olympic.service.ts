import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) { }

  loadInitialData(): Observable<Olympic[] | null> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  private handleError = (error: HttpErrorResponse): Observable<null> => {
    // improve error handling
    // can be useful to end loading state and let the user know something went wrong
    console.error("An error occured:", error.message);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side or network error:', error.error.message)
    } else {
      console.error(`Server-side returned code ${error.status}, body: `, error.error);
    }
    this.olympics$.next(null);
    return of(null);
  }
}
