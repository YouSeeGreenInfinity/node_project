// Базовый ответ API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Успешный ответ
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

// Ошибочный ответ
export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
  code?: number;
}

// Пагинированный ответ
export interface PaginatedResponse<T = any> extends SuccessResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Типы для валидации ошибок
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
}
