// src/validators/user.validator.ts
import Joi from "joi";
import { UpdateUserInput, ChangePasswordInput } from "../types/user.types";

/**
 * Схема валидации для обновления пользователя
 */
export const updateUserSchema = Joi.object<UpdateUserInput>({
  firstName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Имя должно содержать минимум 2 символа",
    "string.max": "Имя не должно превышать 50 символов",
  }),

  lastName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Фамилия должна содержать минимум 2 символа",
    "string.max": "Фамилия не должна превышать 50 символов",
  }),

  middleName: Joi.string().max(50).optional().allow(null, "").messages({
    "string.max": "Отчество не должно превышать 50 символов",
  }),

  birthDate: Joi.alternatives()
    .try(Joi.date().iso(), Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .messages({
      "date.iso": "Дата рождения должна быть в формате YYYY-MM-DD",
      "string.pattern.base": "Дата рождения должна быть в формате YYYY-MM-DD",
    }),

  email: Joi.string().email().optional().messages({
    "string.email": "Некорректный формат email",
  }),

  password: Joi.string().min(6).max(100).optional().messages({
    "string.min": "Пароль должен содержать минимум 6 символов",
    "string.max": "Пароль не должен превышать 100 символов",
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Статус должен быть true или false",
  }),
});

/**
 * Схема валидации для смены пароля
 */
export const changePasswordSchema = Joi.object<ChangePasswordInput>({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Текущий пароль обязателен",
    "any.required": "Текущий пароль обязателен",
  }),

  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.min": "Новый пароль должен содержать минимум 6 символов",
    "string.max": "Новый пароль не должен превышать 100 символов",
    "string.empty": "Новый пароль обязателен",
    "any.required": "Новый пароль обязателен",
  }),
});

/**
 * Схема валидации для пагинации
 */
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Номер страницы должен быть не менее 1",
    "number.integer": "Номер страницы должен быть целым числом",
  }),

  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.min": "Лимит должен быть не менее 1",
    "number.max": "Лимит не должен превышать 100",
    "number.integer": "Лимит должен быть целым числом",
  }),

  role: Joi.string().valid("admin", "user").optional().messages({
    "any.only": 'Роль может быть только "admin" или "user"',
  }),

  isActive: Joi.boolean().optional().messages({
    "boolean.base": "Статус должен быть true или false",
  }),
});
