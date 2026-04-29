'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7EE787', // Pastel Green
      contrastText: '#1F2933',
    },
    secondary: {
      main: '#6FE3D6', // Soft Turquoise
      contrastText: '#1F2933',
    },
    info: {
      main: '#A78BFA', // Pastel Violet
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2933',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em', color: '#1F2933' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', color: '#1F2933' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em', color: '#1F2933' },
    h4: { fontWeight: 600, color: '#1F2933' },
    h5: { fontWeight: 600, color: '#1F2933' },
    h6: { fontWeight: 600, color: '#1F2933' },
    body1: { color: '#1F2933' },
    body2: { color: '#6B7280' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F9FC',
          color: '#1F2933',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #7EE787 0%, #6FE3D6 100%)',
            color: '#1F2933',
            '&:hover': {
              background: 'linear-gradient(135deg, #6FE3D6 0%, #7EE787 100%)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: '16px',
        },
      },
    },
  },
});

export default theme;
