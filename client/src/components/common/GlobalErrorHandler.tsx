import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearError } from '../../store/slices/authSlice';

const GlobalErrorHandler: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);
  
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (error) {
      setOpen(true);
    }
  }, [error]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      dispatch(clearError());
    }, 300);
  };

  if (!error) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorHandler;