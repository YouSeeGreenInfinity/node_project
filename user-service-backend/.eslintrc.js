// module.exports = {
//   env: {
//     browser: true,
//     commonjs: true,
//     es2021: true,
//     node: true,
//   },
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     ecmaVersion: "latest",
//     sourceType: "module",
//     project: "./tsconfig.json",  
//     tsconfigRootDir: __dirname,  
//   },
//   extends: [
//     "airbnb-base",
//     "plugin:@typescript-eslint/recommended",
//     // "plugin:@typescript-eslint/recommended-requiring-type-checking", // ЗАКОММЕНТИРУЙ на время
//   ],
//   plugins: ["@typescript-eslint"],
//   rules: {
//     "no-console": 0,
//     "import/extensions": 0,
//     "import/no-unresolved": 0,
//     'import/prefer-default-export': 'off',
//     'import/prefer-named-export': 'off',
//     "quotes": ["error", "double"],
//     "@typescript-eslint/no-unused-vars": [
//       "error",
//       {
//         argsIgnorePattern: "^_",
//         varsIgnorePattern: "^_",
//       },
//     ],
//     "class-methods-use-this": 0,
//     // "@typescript-eslint/no-misused-promises": "error", // ЗАКОММЕНТИРУЙ
//     "@typescript-eslint/no-explicit-any": "warn",
    
 
//     "@typescript-eslint/no-unsafe-assignment": "off",
//     "@typescript-eslint/no-unsafe-member-access": "off",
//     "@typescript-eslint/no-unsafe-call": "off",
//     "@typescript-eslint/no-unsafe-return": "off",
//   },
//   settings: {
//     "import/resolver": {
//       typescript: {
//         project: "./tsconfig.json",
//       },
//       node: {
//         extensions: [".js", ".jsx", ".ts", ".tsx"],
//       },
//     },
//   },
//   ignorePatterns: ["dist/", "node_modules/", "*.js"], 
// };

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
    project: "./tsconfig.json",  
    tsconfigRootDir: __dirname,  
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "import/prefer-default-export": "off",
    "quotes": ["error", "double"],
    
    // ВИСЯЧИЕ ЗАПЯТЫЕ - НАСТРОЙТЕ ТАК:
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline", 
      "imports": "always-multiline",
      "exports": "always-multiline",
      "functions": "never"
    }],
    
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "class-methods-use-this": 0,
    "@typescript-eslint/no-explicit-any": "warn",
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  ignorePatterns: ["dist/", "node_modules/", "*.js"], 
};