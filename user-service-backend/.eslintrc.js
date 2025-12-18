module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true, // добавьте для Node.js проектов
  },
  // Используйте TypeScript-совместимый парсер
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module", // для ES6 модулей
    project: "./tsconfig.json", // путь к вашему tsconfig
  },

  // Расширения для TypeScript
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // опционально, но строже
  ],

  plugins: ["@typescript-eslint"],

  overrides: [],

  rules: {
    "no-console": 0,

    // Важные правила для TypeScript
    "import/extensions": 0, // Отключаем требование расширений .ts
    "import/no-unresolved": 0, // TypeScript сам проверяет импорты

    // Дополнительные правила
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    // Если используете классы
    "class-methods-use-this": 0,

    // Для async/await в TypeScript
    "@typescript-eslint/no-misused-promises": "error",

    // Строгие правила (опционально)
    "@typescript-eslint/explicit-function-return-type": 0, // можно включить для строгости
    "@typescript-eslint/no-explicit-any": "warn", // предупреждать об any
  },

  // Настройки для импортов TypeScript
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
};
