import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) { }

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getCountryById(countryId: string): Observable<Olympic> {
    return this.olympics$.pipe(
      switchMap((olympics) => {
        if (olympics.length < 1) {
          // If no data is available, load it first
          return this.loadInitialData().pipe(
            map((loadedOlympics) => {
              return this.findCountryById(loadedOlympics, countryId);
            })
          );
        } else {
          return of(this.findCountryById(olympics, countryId))
        }
      }),
      catchError(() => {
        this.handleError;
        return throwError(() => new Error('Country data loaded failed.'))
      })
    )
  }

  private findCountryById(olympics: Olympic[], countryId: string): Olympic {
    if (!olympics) {
      throw new Error('Olympics data not loaded!');
    }
    const foundCountry = olympics.find((country) => country.id.toString() === countryId);
    if (!foundCountry) {
      throw new Error('Country not found!');
    }
    return foundCountry;
  }

  private handleError = (error: HttpErrorResponse): Observable<Olympic[]> => {
    console.error("An error occured:", error.message);
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}. Please check you network.`;
      console.error(`Client-side error: ${error.error.message}`)
    } else {
      errorMessage = `Server error: ${error.status}. Please try later.`;
      console.error(`Server error: ${error.status}, Message: ${error.message}`);
    }
    this.errorMessageService.showError(errorMessage);
    this.olympics$.next([]);
    return of([]);
  }
}
