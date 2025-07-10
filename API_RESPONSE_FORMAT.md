# API Response Format Documentation

This document defines the standardized API response format that all backend endpoints should follow to ensure compatibility with the frontend application.

## Table of Contents

- [Overview](#overview)
- [Base Response Structure](#base-response-structure)
- [Success Responses](#success-responses)
- [Error Responses](#error-responses)
- [Paginated Responses](#paginated-responses)
- [HTTP Status Codes](#http-status-codes)
- [Examples](#examples)
- [Implementation Guidelines](#implementation-guidelines)
- [Frontend Integration](#frontend-integration)

## Overview

All API responses must follow a consistent structure with a `success` field indicating whether the operation was successful, along with additional metadata and data. This ensures seamless integration with the frontend API wrapper and provides type-safe error handling.

## Base Response Structure

Every API response must include these base fields:

```json
{
  "success": true, // Required: true for success, false for errors
  "message": "string", // Optional: Human-readable message
  "timestamp": "string" // Optional: ISO 8601 timestamp (recommended)
}
```

## Success Responses

### Simple Success Response

For endpoints returning a single resource or object:

```json
{
  "success": true,
  "data": {
    // Your actual data object here
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**TypeScript Interface:**

```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
}
```

### Examples

#### User Data Response

```json
{
  "success": true,
  "data": {
    "id": "12345",
    "nickname": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "gender": "male"
  },
  "message": "User retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Event Creation Response

```json
{
  "success": true,
  "data": {
    "id": "event_123",
    "subject": "Team Meeting",
    "content": "Weekly team sync",
    "dateTime": "2024-01-20T14:00:00.000Z",
    "place": "Conference Room A",
    "maxParticipants": 10,
    "currentParticipants": 0,
    "createdBy": "user_456",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Event created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Responses

For failed operations, use this structure with **integer error codes**:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": 4041,
    "details": "Detailed explanation",
    "field": "fieldName"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**TypeScript Interface:**

```typescript
interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code?: number; // Integer error code (preferred)
    details?: string; // Additional error details
    field?: string; // For validation errors
  };
  timestamp?: string;
}
```

### Error Response Examples

#### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": 4000,
    "details": "Email address is required",
    "field": "email"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Authentication Error

```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": 4010,
    "details": "Valid access token required"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Resource Not Found

```json
{
  "success": false,
  "message": "Event not found",
  "error": {
    "code": 4042,
    "details": "No event exists with ID: event_123"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Paginated Responses

For endpoints returning lists with pagination:

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Events retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**TypeScript Interface:**

```typescript
interface PaginatedApiResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number; // Total number of items across all pages
    page: number; // Current page number (1-based)
    limit: number; // Number of items per page
    totalPages: number; // Math.ceil(total / limit)
    hasNext: boolean; // page < totalPages
    hasPrev: boolean; // page > 1
  };
  message?: string;
  timestamp?: string;
}
```

### Paginated Response Example

#### Events List

```json
{
  "success": true,
  "data": [
    {
      "id": "event_1",
      "subject": "Team Meeting",
      "dateTime": "2024-01-20T14:00:00.000Z",
      "place": "Conference Room A",
      "maxParticipants": 10,
      "currentParticipants": 5
    },
    {
      "id": "event_2",
      "subject": "Project Review",
      "dateTime": "2024-01-21T15:00:00.000Z",
      "place": "Conference Room B",
      "maxParticipants": 8,
      "currentParticipants": 3
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Events retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## HTTP Status Codes

Use appropriate HTTP status codes along with the response format:

### Success Responses

- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests (resource creation)
- `204 No Content` - Successful DELETE requests (can omit response body)

### Error Responses

- `400 Bad Request` - Validation errors, malformed requests
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - User lacks permission for the resource
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity` - Validation errors with valid JSON
- `500 Internal Server Error` - Server-side errors

## Examples

### Complete API Endpoint Examples

#### 1. Social Login Token Exchange

**Endpoint:** `POST /api/auth/social/token`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "memberId": "member_123",
    "memberRole": "USER",
    "userInfo": {
      "id": "user_456",
      "nickname": "johndoe",
      "name": "John Doe",
      "email": "john@example.com",
      "gender": "male"
    }
  },
  "message": "Social login successful",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Social login failed",
  "error": {
    "code": 4014,
    "details": "The provided social login token is invalid or expired"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Event Creation

**Endpoint:** `POST /api/events`

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "event_789",
    "subject": "Team Building Event",
    "content": "Annual team building activities",
    "dateTime": "2024-02-15T09:00:00.000Z",
    "place": "Outdoor Park",
    "maxParticipants": 20,
    "currentParticipants": 0,
    "menuId": 3,
    "createdBy": "user_123",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Event created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Validation Error Response (400):**

```json
{
  "success": false,
  "message": "Event creation failed",
  "error": {
    "code": 4004,
    "details": "Date and time must be in the future",
    "field": "dateTime"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 3. Get Events with Pagination

**Endpoint:** `GET /api/events?page=2&limit=5`

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "event_101",
      "subject": "Morning Standup",
      "dateTime": "2024-01-16T09:00:00.000Z",
      "place": "Meeting Room 1",
      "maxParticipants": 12,
      "currentParticipants": 8
    }
  ],
  "pagination": {
    "total": 23,
    "page": 2,
    "limit": 5,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  },
  "message": "Events retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 4. Delete Operation

**Endpoint:** `DELETE /api/events/{id}`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "event_123",
    "deleted": true
  },
  "message": "Event deleted successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Alternative Success Response (204):**

```
HTTP 204 No Content
(Empty body)
```

## Implementation Guidelines

### 1. Consistency Requirements

- ✅ **ALWAYS** include the `success` field
- ✅ **ALWAYS** use `success: true` for successful operations
- ✅ **ALWAYS** use `success: false` for errors
- ✅ **ALWAYS** include appropriate HTTP status codes
- ✅ **RECOMMENDED** to include `timestamp` field

### 2. Data Field Guidelines

- For successful responses, place the main data in the `data` field
- For arrays/lists, use `data` array with `pagination` object
- Keep `data` field consistent in structure for the same endpoint

### 3. Error Handling Best Practices

- Provide clear, actionable error messages
- Use consistent integer error codes for the same types of errors
- Include field information for validation errors
- Don't expose sensitive information in error messages

### 4. Pagination Guidelines

- Use 1-based page numbering (page starts from 1)
- Always calculate and include `totalPages`, `hasNext`, `hasPrev`
- Support configurable `limit` with reasonable defaults (e.g., 10-50)
- Include total count for frontend pagination controls

### 5. Authentication Responses

- For OAuth/social login, include token information in `data`
- Use consistent field names: `token`, `tokenType`, `memberId`, etc.
- Include user information in nested `userInfo` object

### 6. Standardized Error Codes

Use these integer error codes for consistent error handling:

#### Validation Errors (4000-4099)

| Code   | Description              | HTTP Status |
| ------ | ------------------------ | ----------- |
| `4000` | General validation error | 400         |
| `4001` | Missing required field   | 400         |
| `4002` | Invalid data format      | 400         |
| `4003` | Invalid email format     | 400         |
| `4004` | Invalid date format      | 400         |
| `4005` | Field value too short    | 400         |
| `4006` | Field value too long     | 400         |

#### Authentication Errors (4010-4019)

| Code   | Description                  | HTTP Status |
| ------ | ---------------------------- | ----------- |
| `4010` | Authentication required      | 401         |
| `4011` | Invalid access token         | 401         |
| `4012` | Access token expired         | 401         |
| `4013` | Invalid credentials          | 401         |
| `4014` | Invalid social login token   | 401         |
| `4015` | Missing authorization header | 401         |

#### Authorization Errors (4030-4039)

| Code   | Description              | HTTP Status |
| ------ | ------------------------ | ----------- |
| `4030` | Access forbidden         | 403         |
| `4031` | Insufficient permissions | 403         |
| `4032` | Resource access denied   | 403         |

#### Resource Errors (4040-4049)

| Code   | Description        | HTTP Status |
| ------ | ------------------ | ----------- |
| `4040` | Resource not found | 404         |
| `4041` | User not found     | 404         |
| `4042` | Event not found    | 404         |
| `4043` | Menu not found     | 404         |

#### Conflict Errors (4090-4099)

| Code   | Description                   | HTTP Status |
| ------ | ----------------------------- | ----------- |
| `4090` | Resource already exists       | 409         |
| `4091` | Email already exists          | 409         |
| `4092` | Event at maximum capacity     | 409         |
| `4093` | Duplicate event time conflict | 409         |

#### Rate Limiting (4290-4299)

| Code   | Description         | HTTP Status |
| ------ | ------------------- | ----------- |
| `4290` | Rate limit exceeded | 429         |
| `4291` | Too many requests   | 429         |

#### Server Errors (5000-5099)

| Code   | Description                  | HTTP Status |
| ------ | ---------------------------- | ----------- |
| `5000` | Internal server error        | 500         |
| `5001` | Database operation failed    | 500         |
| `5002` | External service unavailable | 502         |
| `5003` | Payment service error        | 502         |
| `5004` | Email service error          | 502         |

### 7. Error Code Benefits

**Why Integer Codes:**

- ✅ **Performance**: Faster comparison and processing
- ✅ **Storage**: More efficient in databases and logs
- ✅ **Internationalization**: Codes map to localized messages
- ✅ **Standardization**: Industry standard approach
- ✅ **Type Safety**: Better TypeScript integration

**Code Structure:**

- `4000-4099`: Client errors (4xx HTTP status)
- `5000-5099`: Server errors (5xx HTTP status)
- Groups by 10s for related error types
- Leaves room for expansion within each group

### 8. Response Size Considerations

- Keep response payloads reasonable in size
- Use pagination for large datasets
- Consider field selection for large objects
- Minimize nested object depth when possible

### 9. Timestamp Format

- Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Always use UTC timezone (Z suffix)
- Include milliseconds for precision

## Frontend Integration

### How Frontend Handles Responses

The frontend uses an API response wrapper that automatically validates and processes responses according to this format. Here's how it works:

#### Automatic Validation

```typescript
// Frontend automatically validates responses
const response = await apiClient.get("/api/events");
const validatedResponse = ApiResponseWrapper.validateResponse<Event[]>(
  response.data
);

// Type-safe access to data
console.log(validatedResponse.data); // Event[]
```

#### Error Handling

```typescript
// Frontend catches and processes error codes
try {
  const user = await UserService.getUser(userId);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 4041: // USER_NOT_FOUND
        showUserNotFoundMessage();
        break;
      case 4010: // UNAUTHORIZED
        redirectToLogin();
        break;
      default:
        showGenericError(error.message);
    }
  }
}
```

#### Pagination Handling

```typescript
// Frontend automatically processes pagination metadata
const eventsList = await EventService.getEvents(page, limit);

// Access pagination info
console.log(eventsList.pagination.hasNext); // boolean
console.log(eventsList.pagination.totalPages); // number
```

### Backend Implementation Checklist

When implementing API endpoints, ensure you:

- [ ] Include `success: true/false` in every response
- [ ] Use appropriate HTTP status codes
- [ ] Include `timestamp` field (recommended)
- [ ] Place main content in `data` field for success responses
- [ ] Use integer error codes from the standardized list
- [ ] Include `pagination` object for list endpoints
- [ ] Calculate `totalPages`, `hasNext`, `hasPrev` for pagination
- [ ] Provide clear error messages and details
- [ ] Don't expose sensitive information in error responses

### Testing Your Implementation

You can test your API responses against the frontend wrapper by ensuring:

1. **Success responses** validate without errors
2. **Error responses** trigger appropriate error handling
3. **Pagination responses** provide all required metadata
4. **Error codes** map to expected frontend behavior

This format ensures seamless integration between backend and frontend, providing type safety, consistent error handling, and optimal user experience.
