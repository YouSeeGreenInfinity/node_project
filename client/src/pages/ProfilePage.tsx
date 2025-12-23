import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getMe, setUser } from '../store/slices/authSlice';
import { updateUser, toggleBlockUser } from '../store/slices/usersSlice';
import { UpdateProfileData, ChangePasswordData } from '../types/user';
import { authApi } from '../api/authApi';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading, error } = useAppSelector((state) => state.users);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [notification, setNotification] = useState<{ 
    open: boolean; 
    message: string; 
    type: 'success' | 'error' 
  } | null>(null);

  const profileForm = useForm<UpdateProfileData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      birthDate: '',
    }
  });

  const passwordForm = useForm<ChangePasswordData>();

  // Инициализация формы данными пользователя
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName || '',
        email: user.email,
        birthDate: user.birthDate 
          ? new Date(user.birthDate).toISOString().split('T')[0] 
          : '',
      });
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (data: UpdateProfileData) => {
    if (!user) return;
    
    try {
      const updatedUser = await dispatch(updateUser({
        id: user.id,
        data: {
          ...data,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        }
      })).unwrap();
      
      // Обновляем пользователя в auth slice
      dispatch(setUser(updatedUser));
      
      setNotification({
        open: true,
        message: 'Профиль успешно обновлен',
        type: 'success',
      });
      setIsEditing(false);
    } catch (err: any) {
      setNotification({
        open: true,
        message: err || 'Ошибка обновления профиля',
        type: 'error',
      });
    }
  };

  const handlePasswordChange = async (data: ChangePasswordData) => {
    if (!user) return;
    
    try {
      await authApi.changePassword(user.id, data);
      setNotification({
        open: true,
        message: 'Пароль успешно изменен',
        type: 'success',
      });
      passwordForm.reset();
      setIsChangingPassword(false);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Ошибка смены пароля',
        type: 'error',
      });
    }
  };

  const handleBlockToggle = async () => {
    if (!user) return;
    
    try {
      await dispatch(toggleBlockUser(user.id)).unwrap();
      // Обновляем данные пользователя
      dispatch(getMe());
      setNotification({
        open: true,
        message: user.isActive 
          ? 'Аккаунт заблокирован' 
          : 'Аккаунт разблокирован',
        type: 'success',
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err || 'Ошибка изменения статуса',
        type: 'error',
      });
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Мой профиль
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Основная информация
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isEditing && (
              <Button 
                variant="outlined" 
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
              >
                Редактировать
              </Button>
            )}
            <Button
              variant="outlined"
              color={user.isActive ? "warning" : "success"}
              onClick={handleBlockToggle}
              disabled={isLoading}
            >
              {user.isActive ? 'Заблокировать' : 'Разблокировать'}
            </Button>
          </Box>
        </Box>

        {isEditing ? (
          <Box component="form" onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  {...profileForm.register('lastName', {
                    required: 'Фамилия обязательна'
                  })}
                  error={!!profileForm.formState.errors.lastName}
                  helperText={profileForm.formState.errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Имя"
                  {...profileForm.register('firstName', {
                    required: 'Имя обязательно'
                  })}
                  error={!!profileForm.formState.errors.firstName}
                  helperText={profileForm.formState.errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Отчество"
                  {...profileForm.register('middleName')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...profileForm.register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Некорректный email'
                    }
                  })}
                  error={!!profileForm.formState.errors.email}
                  helperText={profileForm.formState.errors.email?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Дата рождения"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  {...profileForm.register('birthDate', {
                    required: 'Дата рождения обязательна'
                  })}
                  error={!!profileForm.formState.errors.birthDate}
                  helperText={profileForm.formState.errors.birthDate?.message}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" paragraph>
                <strong>ФИО:</strong> {user.lastName} {user.firstName} {user.middleName || ''}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" paragraph>
                <strong>Дата рождения:</strong> {formatDate(user.birthDate)}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Роль:</strong> {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Статус:</strong> {user.isActive ? 'Активен' : 'Заблокирован'}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Смена пароля
          </Typography>
          {!isChangingPassword && (
            <Button 
              variant="outlined" 
              onClick={() => setIsChangingPassword(true)}
            >
              Сменить пароль
            </Button>
          )}
        </Box>

        {isChangingPassword ? (
          <Box component="form" onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Старый пароль"
                  type="password"
                  {...passwordForm.register('oldPassword', { 
                    required: 'Обязательное поле' 
                  })}
                  error={!!passwordForm.formState.errors.oldPassword}
                  helperText={passwordForm.formState.errors.oldPassword?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Новый пароль"
                  type="password"
                  {...passwordForm.register('newPassword', { 
                    required: 'Обязательное поле',
                    minLength: { 
                      value: 6, 
                      message: 'Минимум 6 символов' 
                    }
                  })}
                  error={!!passwordForm.formState.errors.newPassword}
                  helperText={passwordForm.formState.errors.newPassword?.message}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
              >
                Сменить пароль
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsChangingPassword(false)}
                disabled={isLoading}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Нажмите "Сменить пароль" для изменения пароля
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification && (
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;