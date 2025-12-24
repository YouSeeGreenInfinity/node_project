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
import { register, clearError, clearSuccess } from '../store/slices/authSlice';
import RegisterForm from '../components/auth/RegisterForm';
import { RegisterData } from '../types/user';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, success } = useAppSelector((state) => state.auth);
  
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  // Обработка успешной регистрации
  useEffect(() => {
    if (success) {
      console.log('🟢 Success detected, scheduling redirect');
      setOpenSuccessSnackbar(true);
      
      // Даем пользователю 1.5 секунды прочитать сообщение об успехе перед редиректом
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        // Если после регистрации сразу выдается токен (авто-логин), идем в профиль
        navigate('/profile'); 
        // Если токен не выдается и нужно логиниться руками, замените на navigate('/login');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch, navigate]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      console.log('🔴 Error detected:', error);
      setOpenErrorSnackbar(true);
    }
  }, [error]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = async (data: RegisterData) => {
    // Очищаем предыдущие состояния
    dispatch(clearError());
    dispatch(clearSuccess());
    
    // Отправляем запрос
    await dispatch(register(data));
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    dispatch(clearError());
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  if (isLoading) {
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
          Регистрация...
        </Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
            position: 'relative',
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Регистрация нового пользователя
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" paragraph>
            Заполните все поля для создания учетной записи
          </Typography>

          {/* Инлайн-алерт для ошибок, которые не исчезают сами */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}

          {/* Инлайн-алерт успеха */}
          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
            >
              {success} Перенаправление...
            </Alert>
          )}

          <RegisterForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Уже есть аккаунт?{' '}
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ fontWeight: 'medium', textDecoration: 'none' }}
                color="primary"
              >
                Войти в систему
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

      {/* Всплывающее уведомление об ошибке */}
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
          {error}
        </Alert>
      </Snackbar>

      {/* Всплывающее уведомление об успехе */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success"
          sx={{ width: '100%' }}
        >
          Регистрация успешна!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;
