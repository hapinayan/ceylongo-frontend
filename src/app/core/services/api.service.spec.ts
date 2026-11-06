import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HealthResponse } from '../models/api.models';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // Verify no outstanding HTTP requests occur
  });

  it('should be created with configured base URL', () => {
    expect(service).toBeTruthy();
    expect(service.baseUrl).toBe(environment.apiUrl);
  });

  it('should issue a GET request to the health endpoint and return typed data', () => {
    const mockHealth: HealthResponse = {
      status: 'healthy',
      service: 'CeylonGo Backend',
      database_configured: false,
    };

    let result: HealthResponse | undefined;

    service.getHealth().subscribe((data) => {
      result = data;
    });

    const expectedUrl = `${environment.apiUrl}/api/health`;
    const req = httpTesting.expectOne(expectedUrl);

    expect(req.request.method).toBe('GET');

    req.flush(mockHealth);

    expect(result).toEqual(mockHealth);
  });

  it('should propagate backend HTTP error response details correctly', () => {
    let actualError: Error | undefined;

    service.getHealth().subscribe({
      next: () => {
        throw new Error('Should not have succeeded');
      },
      error: (err: Error) => {
        actualError = err;
      },
    });

    const expectedUrl = `${environment.apiUrl}/api/health`;
    const req = httpTesting.expectOne(expectedUrl);

    req.flush(
      { detail: 'Database connection failed' },
      { status: 503, statusText: 'Service Unavailable' }
    );

    expect(actualError).toBeDefined();
    expect(actualError?.message).toBe('Database connection failed');
  });

  it('should format generic server error status when no detail is provided', () => {
    let actualError: Error | undefined;

    service.getHealth().subscribe({
      next: () => {
        throw new Error('Should not have succeeded');
      },
      error: (err: Error) => {
        actualError = err;
      },
    });

    const expectedUrl = `${environment.apiUrl}/api/health`;
    const req = httpTesting.expectOne(expectedUrl);

    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(actualError).toBeDefined();
    expect(actualError?.message).toContain('Server error (500)');
  });
});
