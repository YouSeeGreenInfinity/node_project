import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Chip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleAdmin = () => {
    navigate('/admin');
    handleMenuClose();
  };

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ: БЕЗОПАСНОЕ ПОЛУЧЕНИЕ ИНИЦИАЛОВ
  const getInitials = () => {
    if (!user) return '';
    // Используем опциональную цепочку и fallback для защиты от undefined/null
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ: БЕЗОПАСНОЕ ПОЛУЧЕНИЕ ИМЕНИ
  const getFullName = () => {
    if (!user) return '';
    const first = user.firstName || '';
    const last = user.lastName || '';
    return `${last} ${first}`.trim();
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          User Management
        </Typography>

        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
              <Chip
                label={user.role === 'admin' ? 'Админ' : 'Пользователь'}
                color={user.role === 'admin' ? 'secondary' : 'default'}
                size="small"
                variant="outlined"
              />
              <Chip
                label={user.isActive ? 'Активен' : 'Заблокирован'}
                color={user.isActive ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 'medium'
                }}
              >
                {getFullName()}
              </Typography>
            </Box>
            
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              aria-controls="user-menu"
              aria-haspopup="true"
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={user.isActive ? 'success' : 'error'}
              >
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                  {getInitials()}
                </Avatar>
              </Badge>
            </IconButton>
            
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfile}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Профиль
                </Typography>
              </MenuItem>
              {user.role === 'admin' && (
                <MenuItem onClick={handleAdmin}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Админ панель
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Выйти
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/login"
              variant="outlined"
              size="small"
            >
              Вход
            </Button>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/register"
              size="small"
              sx={{ color: 'white' }}
            >
              Регистрация
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
