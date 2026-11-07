/**
 * Contract model for the backend service health endpoint.
 * GET /api/health
 */
export interface HealthResponse {
  status: string;
  service: string;
  database_configured: boolean;
}

/**
 * Standardized error envelope returned by the FastAPI backend.
 */
export interface ApiErrorResponse {
  detail: string | Array<{ loc: (string | number)[]; msg: string; type: string }>;
}
