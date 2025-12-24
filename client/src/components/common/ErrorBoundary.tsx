import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            Что-то пошло не так
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Приложение столкнулось с ошибкой. Мы уже работаем над ее устранением.
          </Typography>
          
          {this.state.error && (
            <Box
              sx={{
                p: 2,
                my: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                maxWidth: '600px',
                width: '100%',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleRetry}
            >
              Попробовать снова
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleReload}
            >
              Перезагрузить страницу
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;