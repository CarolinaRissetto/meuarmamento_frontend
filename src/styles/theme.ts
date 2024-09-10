import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ced4da',
          },
          '&.Mui-focused': {
            backgroundColor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {},
          },
        },
        input: {
          backgroundColor: 'white',
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px white inset',
            WebkitTextFillColor: 'inherit',
          },
        },
      },
    },
  },
});

export default defaultTheme;
