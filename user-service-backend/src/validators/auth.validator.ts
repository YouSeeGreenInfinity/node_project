// src/validators/auth.validator.ts
import Joi from "joi";
import { CreateUserInput, LoginInput } from "../types/user.types";

/**
 * Схема валидации для регистрации
 */
export const registerSchema = Joi.object<CreateUserInput>({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Имя должно содержать минимум 2 символа",
    "string.max": "Имя не должно превышать 50 символов",
    "string.empty": "Имя обязательно для заполнения",
    "any.required": "Имя обязательно для заполнения",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Фамилия должна содержать минимум 2 символа",
    "string.max": "Фамилия не должна превышать 50 символов",
    "string.empty": "Фамилия обязательна для заполнения",
    "any.required": "Фамилия обязательна для заполнения",
  }),

  middleName: Joi.string().max(50).optional().allow("").messages({
    "string.max": "Отчество не должно превышать 50 символов",
  }),

  birthDate: Joi.alternatives()
    .try(Joi.date().iso(), Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/))
    .required()
    .messages({
      "date.iso": "Дата рождения должна быть в формате YYYY-MM-DD",
      "string.pattern.base": "Дата рождения должна быть в формате YYYY-MM-DD",
      "any.required": "Дата рождения обязательна для заполнения",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Некорректный формат email",
    "string.empty": "Email обязателен для заполнения",
    "any.required": "Email обязателен для заполнения",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Пароль должен содержать минимум 6 символов",
    "string.max": "Пароль не должен превышать 100 символов",
    "string.empty": "Пароль обязателен для заполнения",
    "any.required": "Пароль обязателен для заполнения",
  }),

  role: Joi.string().valid("admin", "user").default("user").messages({
    "any.only": 'Роль может быть только "admin" или "user"',
  }),
});

/**
 * Схема валидации для авторизации
 */
export const loginSchema = Joi.object<LoginInput>({
  email: Joi.string().email().required().messages({
    "string.email": "Некорректный формат email",
    "string.empty": "Email обязателен для заполнения",
    "any.required": "Email обязателен для заполнения",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Пароль обязателен для заполнения",
    "any.required": "Пароль обязателен для заполнения",
  }),
});
