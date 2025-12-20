## План разработки

### Этап 0: Подготовка и настройка проекта

+0.1. Инициализация проекта + создание репозитория

```bash
mkdir user-service-ts
cd user-service-ts
npm init -y
```

+0.2. **Установка зависимостей**

```bash
# Основные
npm install express
npm install -D typescript ts-node @types/node @types/express

# Sequelize + PostgreSQL
npm install sequelize pg pg-hstore
npm install -D @types/sequelize

# JWT + авторизация
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# Валидация
npm install joi
npm install -D @types/joi

# Переменные окружения
npm install dotenv

# Dev tools
npm install -D nodemon eslint prettier
```

+0.3. **Настройка TypeScript**

```bash
npx tsc --init
```

Настроить `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

+0.4. **Структура проекта (создать папки)**

```
src/
├── config/           # Конфигурация
├── models/           # Модели Sequelize
├── controllers/      # Контроллеры
├── services/         # Бизнес-логика
├── middlewares/      # Промежуточное ПО
├── routes/           # Маршруты
├── validators/       # Валидация
├── types/            # TypeScript типы/интерфейсы
├── utils/            # Вспомогательные функции
├── db/              # Миграции, сиды (если нужно)
└── app.ts           # Основной файл приложения
```

### Этап 1: Настройка базы данных и моделей

+1.1. **Создать конфигурацию БД** (`src/config/database.ts`)

- Настроить подключение к PostgreSQL через Sequelize
- Создать конфиг для development/production

+1.2. **Создать модель User** (`src/models/User.ts`)

```typescript
// Определить интерфейс для TypeScript
interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: Date;
  email: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean;
}

// Sequelize модель с валидациями, хуками (для хеширования пароля)
```

+1.3. **Создать вспомогательные модели/интерфейсы** (`src/types/`):

- `UserInput.ts` - для создания/обновления
- `AuthPayload.ts` - для JWT токена
- `ApiResponse.ts` - типизированные ответы API

### Этап 2: Базовое приложение Express

+2.1. **Создать основной файл приложения** (`src/app.ts`)

- Настроить middleware (json, cors, logging)
- Подключить базу данных
- Создать тестовый маршрут

+2.2. **Создать точку входа** (`src/server.ts`)

- Запуск сервера
- Обработка graceful shutdown

+2.3. **Настроить .env файл**

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_service
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=24h
```

### Этап 3: Сервисный слой и утилиты

1. **Создать сервисы** (`src/services/`):
   - `UserService.ts` - вся бизнес-логика пользователей
   - `AuthService.ts` - регистрация, авторизация, JWT
   - `PasswordService.ts` - хеширование/проверка паролей

2. **Создать утилиты** (`src/utils/`):
   - `jwt.utils.ts` - генерация/верификация токенов
   - `apiResponse.ts` - стандартные ответы API
   - `logger.ts` - логирование

### Этап 4: Middleware и валидация

1. **Middleware для аутентификации** (`src/middlewares/auth.middleware.ts`)
   - Проверка JWT токена
   - Добавление user в request

2. **Middleware для авторизации** (`src/middlewares/role.middleware.ts`)
   - Проверка ролей (admin/user)
   - Проверка доступа к ресурсу

3. **Валидаторы** (`src/validators/`):
   - `auth.validator.ts` - регистрация/авторизация
   - `user.validator.ts` - создание/обновление пользователя
   - Использовать Joi или class-validator

### Этап 5: Контроллеры и маршруты

1. **Контроллеры** (`src/controllers/`):
   - `AuthController.ts` - регистрация, авторизация
   - `UserController.ts` - CRUD операции с пользователями

2. **Маршруты** (`src/routes/`):
   - `auth.routes.ts` - POST /api/auth/register, POST /api/auth/login
   - `user.routes.ts` - GET /api/users, GET /api/users/:id, PATCH /api/users/:id/block
   - `index.ts` - агрегация всех маршрутов

### Этап 6: Финальная сборка и тестирование

1. **Написать скрипты в package.json:**

   ```json
   "scripts": {
     "dev": "nodemon src/server.ts",
     "build": "tsc",
     "start": "node dist/server.js",
     "db:create": "sequelize-cli db:create",
     "db:migrate": "sequelize-cli db:migrate"
   }
   ```

2. **Протестировать все endpoints через Postman/Insomnia:**
   - Регистрация пользователя и админа
   - Авторизация
   - Получение данных (разные роли)
   - Блокировка

3. **Добавить обработку ошибок:**
   - Глобальный error handler
   - Кастомные ошибки (NotFoundError, ValidationError и т.д.)

## Приоритетная последовательность реализации

**Порядк:**

1. **1:** Настройка проекта + модель User + подключение к БД
   - Проверить, что сервер запускается
   - Проверить, что подключается к PostgreSQL
   - Создать таблицу users

2. **2:** Регистрация и авторизация
   - POST /api/auth/register (без JWT, просто создание)
   - POST /api/auth/login (проверка пароля, возврат mock JWT)
   - Добавить хеширование пароля

3. **3:** JWT и middleware
   - Реализовать полноценный JWT
   - Создать middleware аутентификации
   - Защитить один тестовый маршрут

4. **4:** Остальные endpoints
   - GET /api/users/:id (с проверкой прав)
   - GET /api/users (только для admin)
   - PATCH /api/users/:id/block

5. **5:** Рефакторинг и улучшения
   - Валидация входных данных
   - Логирование
   - Обработка ошибок
   - Тесты (если время есть)

## Обратить внимание

1. **TypeScript везде:** Все модели, DTO, ответы API — строгая типизация
2. **Dependency Injection:** Сервисы не зависят напрямую от контроллеров
3. **SOLID принципы:** Каждый класс/функция отвечает за одну вещь
4. **Безопасность:**
   - Пароли никогда не возвращаются в ответах
   - JWT секрет в .env
   - SQL injection защищен через Sequelize
5. **Кодстайл:** ESLint + Prettier с первого дня

## Для фронтенда

1. Создайте отдельный репозиторий для фронта
2. Настройте CORS в Express:
   ```typescript
   app.use(
     cors({
       origin: "http://localhost:3001", // порт фронта
       credentials: true,
     })
   );
   ```
3. JWT можно хранить в:
   - HTTP-only cookies (более безопасно)
   - LocalStorage + заголовок Authorization

Структура API:

GET / → Информация о сервисе
GET /health → Проверка здоровья
GET /api → Информация о API
POST /api/auth/register → Регистрация
POST /api/auth/login → Авторизация
GET /api/auth/me → Текущий пользователь
GET /api/users → Список пользователей (admin)
GET /api/users/:id → Пользователь по ID
PUT /api/users/:id → Обновление пользователя
PATCH /api/users/:id/block → Блокировка/разблокировка
PATCH /api/users/:id/password → Смена пароля
DELETE /api/users/:id → Удаление пользователя (admin)
