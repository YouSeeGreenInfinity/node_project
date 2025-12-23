src/
├── api/
│   ├── apiClient.ts     # axios instance
│   └── authApi.ts       # API вызовы
├── components/
│   ├── Layout.tsx       # Общий layout
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── UserList.tsx     # Только для админа
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfilePage.tsx  # Просмотр/редактирование своего профиля
│   └── AdminPage.tsx    # Для админа: список пользователей
├── store/
│   ├── authSlice.ts     # Только авторизация
│   └── index.ts
├── types/
│   └── user.ts
├── App.tsx
└── main.tsx