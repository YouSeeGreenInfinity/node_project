import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  // CircularProgress, // Не использовался
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, toggleBlockUser } from '../store/slices/usersSlice';
import UserList from '../components/users/UserList';

const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { users, isLoading, error } = useAppSelector((state) => state.users);
  
  const [notification, setNotification] = React.useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser]);

  const handleBlockUser = async (userId: number) => {
    try {
      // ИСПРАВЛЕНИЕ: Находим пользователя в стейте, чтобы узнать его текущий статус
      const userToUpdate = users.find(u => u.id === userId);
      
      if (!userToUpdate) {
          throw new Error("Пользователь не найден в списке");
      }

      // Передаем объект { id, isActive } в thunk
      await dispatch(toggleBlockUser({ 
          id: userId, 
          isActive: !userToUpdate.isActive // Инвертируем текущий статус
      })).unwrap();

      setNotification({
        open: true,
        message: `Пользователь ${userToUpdate.isActive ? 'заблокирован' : 'разблокирован'}`,
        type: 'success',
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.message || err || 'Ошибка изменения статуса',
        type: 'error',
      });
    }
  };

  const handleEditUser = (userId: number) => {
    console.log('Edit user:', userId);
  };

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">
          У вас нет прав для доступа к этой странице
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Панель администратора
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Управление пользователями системы. Всего пользователей: {users.length}
      </Typography>

      {error && !isLoading && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}

      <UserList
        users={users}
        isLoading={isLoading}
        error={error}
        onBlockUser={handleBlockUser}
        onEditUser={handleEditUser}
        onRefresh={handleRefresh}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;
