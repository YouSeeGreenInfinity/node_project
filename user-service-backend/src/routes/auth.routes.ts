// import { Router } from "express";
// import { AuthController } from "../controllers/AuthController";
// import { validateBody } from "../validators/validate.middleware";
// import { registerSchema, loginSchema } from "../validators/auth.validator";
// import { authenticate } from "../middlewares/auth.middleware";

// const router = Router();

// /**
//  * @route POST /api/v1/auth/register
//  * @desc Регистрация нового пользователя
//  * @access Public
//  */
// router.post("/register", validateBody(registerSchema), AuthController.register);

// /**
//  * @route POST /api/v1/auth/login
//  * @desc Авторизация пользователя
//  * @access Public
//  */
// router.post("/login", validateBody(loginSchema), AuthController.login);

// /**
//  * @route GET /api/v1/auth/me
//  * @desc Получение текущего пользователя
//  * @access Private
//  */
// router.get("/me", authenticate, AuthController.getCurrentUser);

// /**
//  * @route POST /api/v1/auth/refresh
//  * @desc Обновление JWT токена
//  * @access Private
//  */
// router.post("/refresh", authenticate, AuthController.refreshToken);

// export default router;


// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../validators/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               middleName:
 *                 type: string
 *                 maxLength: 50
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               birthDate:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации или пользователь уже существует
 */
router.post('/register', 
  validateBody(registerSchema),
  AuthController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/login',
  validateBody(loginSchema),
  AuthController.login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Получение текущего пользователя
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные текущего пользователя
 *       401:
 *         description: Пользователь не авторизован
 */
router.get('/me', 
  AuthController.getCurrentUser
);

export default router;