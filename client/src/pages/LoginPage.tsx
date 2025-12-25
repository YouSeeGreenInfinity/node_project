import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError, clearSuccess } from '../store/slices/authSlice';
import LoginForm from '../components/auth/LoginForm';
import { LoginData } from '../types/user';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading, error, success } = useAppSelector((state) => state.auth);
  
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setOpenErrorSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = async (data: LoginData) => {
    dispatch(clearError());
    dispatch(clearSuccess());
    await dispatch(login(data));
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    dispatch(clearError());
  };

  // Вспомогательная функция для безопасного вывода ошибки
  const renderError = (err: any) => {
    if (!err) return null;
    if (typeof err === 'string') return err;
    // Если вдруг прилетел объект - превращаем его в строку, чтобы увидеть на экране
    return JSON.stringify(err?.message || err);
  };

  if (isLoading && !error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Авторизация...
        </Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          {/* Убрали дублирующий Alert отсюда, так как передаем ошибку прямо в форму */}
          
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={renderError(error)} // <--- ВАЖНО: Передаем ошибку!
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Еще нет аккаунта?{' '}
              <Link
                component={RouterLink}
                to="/register"
                variant="body2"
                sx={{ fontWeight: 'medium', textDecoration: 'none' }}
                color="primary"
              >
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Вернуться на главную
            </Link>
          </Box>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} User Management System
          </Typography>
        </Box>
      </Box>

      {/* Snackbar для ошибок */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseErrorSnackbar} 
          severity="error"
          sx={{ width: '100%' }}
        >
           {/* Тоже используем безопасный рендер */}
           {renderError(error)}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
