import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon, // Добавил иконку для разблокировки
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { SafeUser } from '../../types/user';

interface UserListProps {
  users: SafeUser[];
  isLoading: boolean;
  error: string | null;
  onBlockUser: (userId: number) => Promise<void>;
  onEditUser?: (userId: number) => void;
  onRefresh: () => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  isLoading,
  error,
  onBlockUser,
  onEditUser,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [blockingUserId, setBlockingUserId] = useState<number | null>(null);

  const filteredUsers = users.filter((user) =>
    `${user.lastName} ${user.firstName} ${user.middleName || ''} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBlockUser = async (userId: number) => {
    setBlockingUserId(userId);
    try {
      await onBlockUser(userId);
    } finally {
      setBlockingUserId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Пользователи ({filteredUsers.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Tooltip title="Обновить">
            {/* Обернули в span на всякий случай, если кнопка будет disabled */}
            <span>
              <IconButton onClick={onRefresh} disabled={isLoading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>ID</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата регистрации</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    Пользователи не найдены
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {user.lastName} {user.firstName} {user.middleName || ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(user.birthDate)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? 'Админ' : 'Пользователь'}
                        color={user.role === 'admin' ? 'secondary' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={user.isActive ? <ActiveIcon fontSize="small" /> : undefined}
                        label={user.isActive ? 'Активен' : 'Заблокирован'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {onEditUser && (
                          <Tooltip title="Редактировать">
                            <IconButton
                              size="small"
                              onClick={() => onEditUser(user.id)}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* --- ИСПРАВЛЕННЫЙ БЛОК БЛОКИРОВКИ --- */}
                        <Tooltip
                          title={
                            user.role === 'admin' 
                              ? "Нельзя заблокировать администратора" 
                              : user.isActive ? 'Заблокировать' : 'Разблокировать'
                          }
                        >
                          {/* Span нужен, чтобы Tooltip работал даже на disabled кнопке */}
                          <span>
                            <IconButton
                              size="small"
                              onClick={() => handleBlockUser(user.id)}
                              // Блокируем кнопку, если идет загрузка ИЛИ если это админ
                              disabled={blockingUserId === user.id || user.role === 'admin'}
                              color={user.isActive ? 'warning' : 'success'}
                            >
                                {blockingUserId === user.id ? (
                                  <CircularProgress size={20} />
                                ) : user.isActive ? (
                                  <BlockIcon fontSize="small" />
                                ) : (
                                  <ActiveIcon fontSize="small" />
                                )}
                            </IconButton>
                          </span>
                        </Tooltip>
                        {/* ------------------------------------- */}
                        
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} из ${count}`
        }
      />
    </Paper>
  );
};

export default UserList;
