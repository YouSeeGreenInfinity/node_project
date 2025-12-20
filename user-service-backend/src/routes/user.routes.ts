// import { Router } from "express";
// import { UserController } from "../controllers/UserController";
// import {
//   authenticate,
//   requireRole,
//   requireOwnershipOrAdmin,
// } from "../middlewares/auth.middleware";
// import {
//   validateBody,
//   validateQuery,
//   validateId,
// } from "../validators/validate.middleware";
// import {
//   updateUserSchema,
//   changePasswordSchema,
//   paginationSchema,
// } from "../validators/user.validator";

// const router = Router();

// /**
//  * @route GET /api/v1/users
//  * @desc Получение списка всех пользователей
//  * @access Private (Admin only)
//  */
// router.get(
//   "/",
//   authenticate,
//   requireRole("admin"),
//   validateQuery(paginationSchema),
//   UserController.getAllUsers
// );

// /**
//  * @route GET /api/v1/users/:id
//  * @desc Получение пользователя по ID
//  * @access Private (Self or Admin)
//  */
// router.get(
//   "/:id",
//   authenticate,
//   validateId,
//   requireOwnershipOrAdmin(),
//   UserController.getUserById
// );

// /**
//  * @route PUT /api/v1/users/:id
//  * @desc Обновление пользователя
//  * @access Private (Self or Admin)
//  */
// router.put(
//   "/:id",
//   authenticate,
//   validateId,
//   requireOwnershipOrAdmin(),
//   validateBody(updateUserSchema),
//   UserController.updateUser
// );

// /**
//  * @route PATCH /api/v1/users/:id/block
//  * @desc Блокировка/разблокировка пользователя
//  * @access Private (Self or Admin)
//  */
// router.patch(
//   "/:id/block",
//   authenticate,
//   validateId,
//   requireOwnershipOrAdmin(),
//   validateBody(changePasswordSchema.pick({ isActive: true })),
//   UserController.toggleUserBlock
// );

// /**
//  * @route PATCH /api/v1/users/:id/password
//  * @desc Смена пароля
//  * @access Private (Self only)
//  */
// router.patch(
//   "/:id/password",
//   authenticate,
//   validateId,
//   requireOwnershipOrAdmin(), // Только сам пользователь
//   validateBody(changePasswordSchema),
//   UserController.changePassword
// );

// /**
//  * @route DELETE /api/v1/users/:id
//  * @desc Удаление пользователя
//  * @access Private (Admin only, нельзя удалить себя)
//  */
// router.delete(
//   "/:id",
//   authenticate,
//   validateId,
//   requireRole("admin"),
//   UserController.deleteUser
// );

// export default router;

// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {
  authenticate,
  requireRole,
  requireOwnershipOrAdmin,
} from "../middlewares/auth.middleware";
import { validateQuery, validateId } from "../validators/validate.middleware";
import { paginationSchema } from "../validators/user.validator";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получение списка всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Количество записей на странице
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         description: Фильтр по роли
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Фильтр по активности
 *     responses:
 *       200:
 *         description: Список пользователей
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Недостаточно прав (требуется роль admin)
 */
router.get(
  "/",
  authenticate,
  requireRole("admin"),
  validateQuery(paginationSchema),
  UserController.getAllUsers
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получение пользователя по ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Недостаточно прав (только свой профиль или admin)
 *       404:
 *         description: Пользователь не найден
 */
router.get(
  "/:id",
  authenticate,
  validateId,
  requireOwnershipOrAdmin(),
  UserController.getUserById
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновление пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               birthDate:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Недостаточно прав (только свой профиль или admin)
 *       404:
 *         description: Пользователь не найден
 */
router.put(
  "/:id",
  authenticate,
  validateId,
  requireOwnershipOrAdmin(),
  UserController.updateUser
);

/**
 * @swagger
 * /api/users/{id}/block:
 *   patch:
 *     summary: Блокировка/разблокировка пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: false - заблокировать, true - разблокировать
 *     responses:
 *       200:
 *         description: Статус пользователя изменен
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Недостаточно прав или нельзя заблокировать admin
 *       404:
 *         description: Пользователь не найден
 */
router.patch(
  "/:id/block",
  authenticate,
  validateId,
  requireOwnershipOrAdmin(),
  UserController.toggleUserBlock
);

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     summary: Смена пароля
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Пароль успешно изменен
 *       400:
 *         description: Неверный текущий пароль или слабый новый пароль
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Можно менять только свой пароль
 *       404:
 *         description: Пользователь не найден
 */
router.patch(
  "/:id/password",
  authenticate,
  validateId,
  requireOwnershipOrAdmin(),
  UserController.changePassword
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Пользователь удален
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Недостаточно прав (только admin и нельзя удалить себя)
 *       404:
 *         description: Пользователь не найден
 */
router.delete(
  "/:id",
  authenticate,
  validateId,
  requireRole("admin"),
  UserController.deleteUser
);

export default router;
