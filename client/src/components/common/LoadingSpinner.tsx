import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  size = 40,
  color = 'primary'
}) => {
  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <CircularProgress color={color} size={size} />
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
      }}
    >
      <CircularProgress color={color} size={size} />
    </Box>
  );
};

export default LoadingSpinner;