import React from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Grid,
} from '@mui/material';
import { RegisterData } from '../types/user';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  isLoading: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, error }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();

  const submitHandler = (data: RegisterData) => {
    onSubmit({
      ...data,
      birthDate: new Date(data.birthDate),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(submitHandler)} sx={{ mt: 1 }}>
      <Typography variant="h5" gutterBottom>
        Регистрация
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Фамилия"
            {...register('lastName', { 
              required: 'Фамилия обязательна'
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Имя"
            {...register('firstName', { 
              required: 'Имя обязательно'
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Отчество"
            {...register('middleName')}
            error={!!errors.middleName}
            helperText={errors.middleName?.message}
          />
        </Grid>
      </Grid>

      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        type="email"
        autoComplete="email"
        {...register('email', { 
          required: 'Email обязателен',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Некорректный email'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Пароль"
        type="password"
        {...register('password', { 
          required: 'Пароль обязателен',
          minLength: {
            value: 6,
            message: 'Минимум 6 символов'
          }
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Дата рождения"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register('birthDate', { 
          required: 'Дата рождения обязательна'
        })}
        error={!!errors.birthDate}
        helperText={errors.birthDate?.message}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </Box>
  );
};

export default RegisterForm;