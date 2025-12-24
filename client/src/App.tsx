import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './store';
import { getMe } from './store/slices/authSlice';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/common/Layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

// Компонент для инициализации авторизации
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch();
  const { token, user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, token, user]);

  if (token && !user && isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};

// Защищенный маршрут
const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

// Публичный маршрут (только для неавторизованных)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};

// Основные маршруты приложения
const AppRoutes: React.FC = () => {
  return (
    <AuthInitializer>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/profile" replace />} />
          
          <Route path="profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          <Route path="admin" element={
            <PrivateRoute adminOnly>
              <AdminPage />
            </PrivateRoute>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthInitializer>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;