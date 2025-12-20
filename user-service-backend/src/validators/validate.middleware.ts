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

    // Заменяем body на валидированные данные
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

    req.query = value;
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

    req.params = value;
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
