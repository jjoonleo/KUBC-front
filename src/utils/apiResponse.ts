// Error code enums with integer values for better performance and standardization
export enum ApiErrorCode {
  // Validation Errors (4000-4099)
  VALIDATION_ERROR = 4000,
  MISSING_REQUIRED_FIELD = 4001,
  INVALID_FORMAT = 4002,
  INVALID_EMAIL_FORMAT = 4003,
  INVALID_DATE_FORMAT = 4004,
  FIELD_TOO_SHORT = 4005,
  FIELD_TOO_LONG = 4006,

  // Authentication Errors (4010-4019)
  UNAUTHORIZED = 4010,
  INVALID_TOKEN = 4011,
  TOKEN_EXPIRED = 4012,
  INVALID_CREDENTIALS = 4013,
  INVALID_SOCIAL_TOKEN = 4014,
  MISSING_AUTH_HEADER = 4015,

  // Authorization Errors (4030-4039)
  FORBIDDEN = 4030,
  INSUFFICIENT_PERMISSIONS = 4031,
  RESOURCE_ACCESS_DENIED = 4032,

  // Resource Errors (4040-4049)
  NOT_FOUND = 4040,
  USER_NOT_FOUND = 4041,
  EVENT_NOT_FOUND = 4042,
  MENU_NOT_FOUND = 4043,

  // Conflict Errors (4090-4099)
  DUPLICATE_RESOURCE = 4090,
  EMAIL_ALREADY_EXISTS = 4091,
  EVENT_FULL = 4092,
  DUPLICATE_EVENT = 4093,

  // Rate Limiting (4290-4299)
  RATE_LIMIT_EXCEEDED = 4290,
  TOO_MANY_REQUESTS = 4291,

  // Server Errors (5000-5099)
  INTERNAL_ERROR = 5000,
  DATABASE_ERROR = 5001,
  EXTERNAL_SERVICE_ERROR = 5002,
  PAYMENT_SERVICE_ERROR = 5003,
  EMAIL_SERVICE_ERROR = 5004,
}

// Human-readable error code descriptions
export const ApiErrorCodeMessages: Record<ApiErrorCode, string> = {
  // Validation Errors
  [ApiErrorCode.VALIDATION_ERROR]: "Validation failed",
  [ApiErrorCode.MISSING_REQUIRED_FIELD]: "Required field is missing",
  [ApiErrorCode.INVALID_FORMAT]: "Invalid data format",
  [ApiErrorCode.INVALID_EMAIL_FORMAT]: "Invalid email format",
  [ApiErrorCode.INVALID_DATE_FORMAT]: "Invalid date format",
  [ApiErrorCode.FIELD_TOO_SHORT]: "Field value is too short",
  [ApiErrorCode.FIELD_TOO_LONG]: "Field value is too long",

  // Authentication Errors
  [ApiErrorCode.UNAUTHORIZED]: "Authentication required",
  [ApiErrorCode.INVALID_TOKEN]: "Invalid access token",
  [ApiErrorCode.TOKEN_EXPIRED]: "Access token has expired",
  [ApiErrorCode.INVALID_CREDENTIALS]: "Invalid username or password",
  [ApiErrorCode.INVALID_SOCIAL_TOKEN]: "Invalid social login token",
  [ApiErrorCode.MISSING_AUTH_HEADER]: "Authorization header is missing",

  // Authorization Errors
  [ApiErrorCode.FORBIDDEN]: "Access forbidden",
  [ApiErrorCode.INSUFFICIENT_PERMISSIONS]: "Insufficient permissions",
  [ApiErrorCode.RESOURCE_ACCESS_DENIED]: "Access to resource denied",

  // Resource Errors
  [ApiErrorCode.NOT_FOUND]: "Resource not found",
  [ApiErrorCode.USER_NOT_FOUND]: "User not found",
  [ApiErrorCode.EVENT_NOT_FOUND]: "Event not found",
  [ApiErrorCode.MENU_NOT_FOUND]: "Menu not found",

  // Conflict Errors
  [ApiErrorCode.DUPLICATE_RESOURCE]: "Resource already exists",
  [ApiErrorCode.EMAIL_ALREADY_EXISTS]: "Email address already exists",
  [ApiErrorCode.EVENT_FULL]: "Event is at maximum capacity",
  [ApiErrorCode.DUPLICATE_EVENT]: "Event already exists at this time",

  // Rate Limiting
  [ApiErrorCode.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",
  [ApiErrorCode.TOO_MANY_REQUESTS]: "Too many requests",

  // Server Errors
  [ApiErrorCode.INTERNAL_ERROR]: "Internal server error",
  [ApiErrorCode.DATABASE_ERROR]: "Database operation failed",
  [ApiErrorCode.EXTERNAL_SERVICE_ERROR]: "External service unavailable",
  [ApiErrorCode.PAYMENT_SERVICE_ERROR]: "Payment service error",
  [ApiErrorCode.EMAIL_SERVICE_ERROR]: "Email service error",
};

// Utility function to get error message from code
export function getErrorMessage(code: ApiErrorCode): string {
  return ApiErrorCodeMessages[code] || "Unknown error";
}

// Base API Response Interface
export interface BaseApiResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

// Generic Success Response with Data
export interface ApiResponse<T = any> extends BaseApiResponse {
  data: T;
}

// Generic Error Response with improved typing
export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error?: {
    code?: ApiErrorCode | number | string; // Allow enum, number, or string for backward compatibility
    details?: string;
    field?: string; // For validation errors
  };
}

// Paginated Response
export interface PaginatedApiResponse<T = any> extends BaseApiResponse {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// Union type for all possible API responses
export type ApiResponseUnion<T = any> =
  | ApiResponse<T>
  | ApiErrorResponse
  | PaginatedApiResponse<T>;

// Type guards for response types
export const isSuccessResponse = <T>(
  response: ApiResponseUnion<T>
): response is ApiResponse<T> => {
  return response.success === true && "data" in response;
};

export const isErrorResponse = (
  response: ApiResponseUnion<any>
): response is ApiErrorResponse => {
  return response.success === false;
};

export const isPaginatedResponse = <T>(
  response: ApiResponseUnion<T>
): response is PaginatedApiResponse<T> => {
  return response.success === true && "pagination" in response;
};

// Response wrapper utility class
export class ApiResponseWrapper {
  // Create a success response
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  // Create an error response
  static error(
    message: string,
    error?: {
      code?: ApiErrorCode | number | string;
      details?: string;
      field?: string;
    }
  ): ApiErrorResponse {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  }

  // Create a paginated response
  static paginated<T>(
    data: T[],
    pagination: {
      total: number;
      page: number;
      limit: number;
    },
    message?: string
  ): PaginatedApiResponse<T> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return {
      success: true,
      data,
      pagination: {
        ...pagination,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
      message,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle axios response and validate it matches expected structure
  static validateResponse<T>(response: any): ApiResponse<T> {
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format");
    }

    if (response.success === false) {
      throw new ApiError(
        response.message || "API request failed",
        response.error?.code,
        response.error?.details
      );
    }

    if (response.success !== true || !("data" in response)) {
      throw new Error("Invalid success response format");
    }

    return response as ApiResponse<T>;
  }

  // Handle paginated response validation
  static validatePaginatedResponse<T>(response: any): PaginatedApiResponse<T> {
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format");
    }

    if (response.success === false) {
      throw new ApiError(
        response.message || "API request failed",
        response.error?.code,
        response.error?.details
      );
    }

    if (
      response.success !== true ||
      !("data" in response) ||
      !("pagination" in response) ||
      !Array.isArray(response.data)
    ) {
      throw new Error("Invalid paginated response format");
    }

    return response as PaginatedApiResponse<T>;
  }
}

// Custom API Error class
export class ApiError extends Error {
  public readonly code?: ApiErrorCode | number | string;
  public readonly details?: string;
  public readonly isApiError = true;

  constructor(
    message: string,
    code?: ApiErrorCode | number | string,
    details?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // Get human-readable error message
  getCodeMessage(): string {
    if (typeof this.code === "number" && this.code in ApiErrorCodeMessages) {
      return getErrorMessage(this.code as ApiErrorCode);
    }
    return this.message;
  }

  // Check if code is a standard API error code
  isStandardError(): boolean {
    return typeof this.code === "number" && this.code in ApiErrorCodeMessages;
  }
}

// Type helper for extracting data type from API response
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;
export type ExtractPaginatedData<T> = T extends PaginatedApiResponse<infer U>
  ? U
  : never;
