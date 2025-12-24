// import React, { useEffect } from 'react';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import {
//   Container,
//   Box,
//   Paper,
//   Typography,
//   Link,
//   Alert,
//   CircularProgress,
// } from '@mui/material';
// import { useAppDispatch, useAppSelector } from '../store/hooks';
// import { login, clearError } from '../store/slices/authSlice';
// import LoginForm from '../components/auth/LoginForm';
// import { LoginData } from '../types/user';

// const LoginPage: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { user, isLoading, error } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (user) {
//       navigate('/profile');
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     // Очищаем ошибку при размонтировании
//     return () => {
//       dispatch(clearError());
//     };
//   }, [dispatch]);

//   const handleSubmit = async (data: LoginData) => {
//     await dispatch(login(data));
//   };

//   if (isLoading && !error) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Container component="main" maxWidth="sm">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             width: '100%',
//             borderRadius: 2,
//           }}
//         >
//           <Typography component="h1" variant="h5" align="center" gutterBottom>
//             Вход в систему
//           </Typography>

//           <Typography variant="body2" color="text.secondary" align="center" paragraph>
//             Введите ваши учетные данные для входа в систему
//           </Typography>

//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ mb: 2 }}
//               onClose={() => dispatch(clearError())}
//             >
//               {error}
//             </Alert>
//           )}

//           <LoginForm
//             onSubmit={handleSubmit}
//             isLoading={isLoading}
//           />

//           <Box sx={{ mt: 3, textAlign: 'center' }}>
//             <Typography variant="body2" color="text.secondary">
//               Еще нет аккаунта?{' '}
//               <Link
//                 component={RouterLink}
//                 to="/register"
//                 variant="body2"
//                 sx={{ fontWeight: 'medium' }}
//               >
//                 Зарегистрироваться
//               </Link>
//             </Typography>
//           </Box>

//           <Box sx={{ mt: 2, textAlign: 'center' }}>
//             <Link
//               component={RouterLink}
//               to="/"
//               variant="body2"
//               color="text.secondary"
//             >
//               Вернуться на главную
//             </Link>
//           </Box>
//         </Paper>

//         <Box sx={{ mt: 4, textAlign: 'center' }}>
//           <Typography variant="caption" color="text.secondary">
//             © {new Date().getFullYear()} User Management System
//           </Typography>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default LoginPage;

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
    // Очищаем ошибки при размонтировании
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleSubmit = async (data: LoginData) => {
    console.log('Login form submitted:', data.email);
    
    // Очищаем предыдущие ошибки
    dispatch(clearError());
    dispatch(clearSuccess());
    
    const result = await dispatch(login(data));
    
    if (login.fulfilled.match(result)) {
      console.log('Login successful, redirecting...');
      // Редирект произойдет автоматически
    } else if (login.rejected.match(result)) {
      console.log('Login failed with error:', result.error);
    }
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
    dispatch(clearError());
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
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Вход в систему
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" paragraph>
            Введите ваши учетные данные для входа в систему
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearError())}
            >
              <Typography variant="body2" fontWeight="medium">
                Ошибка авторизации:
              </Typography>
              <Typography variant="body2">
                {error}
              </Typography>
            </Alert>
          )}

          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
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
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;