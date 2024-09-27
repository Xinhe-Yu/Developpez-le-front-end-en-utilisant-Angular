import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
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

  getCountryById(countryId: string): Observable<Olympic> {
    return this.olympics$.pipe(
      switchMap((olympics) => {
        if (!olympics) {
          return this.loadInitialData().pipe(
            map((loadedOlympics) => {
              return this.findCountryById(loadedOlympics, countryId);
            })
          );
        } else {
          return of(this.findCountryById(olympics, countryId))
        }
      }),
      catchError(err => {
        console.error(err);
        return throwError(() => new Error('Country data loaded failed.'))
      })
    )
  }

  private findCountryById(olympics: Olympic[] | null, countryId: string): Olympic {
    if (!olympics) {
      throw new Error('Olympics data not loaded!');
    }
    const foundCountry = olympics.find((country) => country.id.toString() === countryId);
    if (!foundCountry) {
      throw new Error('Country not found!');
    }
    return foundCountry;
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
