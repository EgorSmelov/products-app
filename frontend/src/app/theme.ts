import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#6366F1',
    },
    background: {
      default: '#F3F4F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: 24,
          paddingBottom: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#6B7280',
          borderBottomColor: '#E5E7EB',
        },
        body: {
          fontSize: '0.875rem',
          borderBottomColor: '#E5E7EB',
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-of-type td, &:last-of-type th': {
            borderBottom: 0,
          },
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
  },
})

