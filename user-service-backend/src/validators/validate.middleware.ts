import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import { ValidationErrorResponse } from "../types/api.types";

/**
 * Middleware для валидации тела запроса
 */
export const validateBody =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      const errorResponse: ValidationErrorResponse = {
        success: false,
        message: "Ошибка валидации",
        error: "Validation failed",
        errors,
        timestamp: new Date(),
      };

      return res.status(400).json(errorResponse);
    }

    // Body обычно можно перезаписывать, но для единообразия лучше так
    req.body = value;
    next();
  };

/**
 * Middleware для валидации query параметров
 */
export const validateQuery =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      const errorResponse: ValidationErrorResponse = {
        success: false,
        message: "Ошибка валидации query параметров",
        error: "Query validation failed",
        errors,
        timestamp: new Date(),
      };

      return res.status(400).json(errorResponse);
    }

    // ИСПРАВЛЕНИЕ: Вместо перезаписи ссылки, обновляем объект
    // Сначала очищаем старые ключи (если нужно, чтобы stripUnknown работал на уровне объекта)
    for (const key in req.query) {
      delete req.query[key];
    }
    // Затем копируем валидированные данные
    Object.assign(req.query, value);

    next();
  };

/**
 * Middleware для валидации params
 */
export const validateParams =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      const errorResponse: ValidationErrorResponse = {
        success: false,
        message: "Ошибка валидации параметров",
        error: "Params validation failed",
        errors,
        timestamp: new Date(),
      };

      return res.status(400).json(errorResponse);
    }

    // ИСПРАВЛЕНИЕ: То же самое для params
    // params в express обычно тоже readonly ссылка
    // Однако Express сам парсит params до middleware.
    // Если Joi трансформирует типы (строка "1" -> число 1), это важно.

    // Но params в req это Proxy в некоторых версиях, поэтому Object.assign безопаснее.
    Object.assign(req.params, value);

    next();
  };

/**
 * Схема для валидации ID
 */
export const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID должен быть числом",
    "number.integer": "ID должен быть целым числом",
    "number.positive": "ID должен быть положительным числом",
    "any.required": "ID обязателен",
  }),
});

/**
 * Валидатор для ID параметра
 */
export const validateId = validateParams(idSchema);
