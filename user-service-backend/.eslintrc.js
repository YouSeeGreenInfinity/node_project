// module.exports = {
//   env: {
//     browser: true,
//     commonjs: true,
//     es2021: true,
//     node: true, // добавьте для Node.js проектов
//   },
//   // Используйте TypeScript-совместимый парсер
//   parser: "@typescript-eslint/parser",

//   parserOptions: {
//     ecmaVersion: "latest",
//     sourceType: "module", // для ES6 модулей
//     project: "./tsconfig.json", // путь к вашему tsconfig
//   },

//   // Расширения для TypeScript
//   extends: [
//     "airbnb-base",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:@typescript-eslint/recommended-requiring-type-checking", // опционально, но строже
//   ],

//   plugins: ["@typescript-eslint"],

//   overrides: [],

//   rules: {
//     "no-console": 0,

//     // Важные правила для TypeScript
//     "import/extensions": 0, // Отключаем требование расширений .ts
//     "import/no-unresolved": 0, // TypeScript сам проверяет импорты

//     // Дополнительные правила
//     "@typescript-eslint/no-unused-vars": [
//       "error",
//       {
//         argsIgnorePattern: "^_",
//         varsIgnorePattern: "^_",
//       },
//     ],

//     // Если используете классы
//     "class-methods-use-this": 0,

//     // Для async/await в TypeScript
//     "@typescript-eslint/no-misused-promises": "error",

//     // Строгие правила (опционально)
//     "@typescript-eslint/explicit-function-return-type": 0, // можно включить для строгости
//     "@typescript-eslint/no-explicit-any": "warn", // предупреждать об any
//   },

//   // Настройки для импортов TypeScript
//   settings: {
//     "import/resolver": {
//       typescript: {
//         alwaysTryTypes: true,
//         project: "./tsconfig.json",
//       },
//     },
//   },
// };

// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",  // Убедись, что этот путь правильный
    tsconfigRootDir: __dirname,  // ДОБАВЬ ЭТУ СТРОКУ!
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking", // ЗАКОММЕНТИРУЙ на время
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "quotes": ["error", "double"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "class-methods-use-this": 0,
    // "@typescript-eslint/no-misused-promises": "error", // ЗАКОММЕНТИРУЙ
    "@typescript-eslint/no-explicit-any": "warn",
    
    // ДОБАВЬ ЭТИ ПРАВИЛА для отключения строгих проверок:
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js"],  // ДОБАВЬ эту строку
};
