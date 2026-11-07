import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HealthResponse } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  /**
   * Health-check connectivity test against the FastAPI backend.
   * GET /api/health
   */
  getHealth(): Observable<HealthResponse> {
    return this.http
      .get<HealthResponse>(`${this.baseUrl}/api/health`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Standard error handler propagating descriptive error messages.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected network error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'object' && 'detail' in error.error) {
      errorMessage = typeof error.error.detail === 'string'
        ? error.error.detail
        : JSON.stringify(error.error.detail);
    } else if (error.status) {
      errorMessage = `Server error (${error.status}): ${error.statusText || 'Request failed'}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
