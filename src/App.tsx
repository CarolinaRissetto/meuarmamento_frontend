import React from 'react';
import Formulario from './pages/Cadastro'
import "./syles.css";
import Header from './components/Header';
import {
  CssBaseline,
  createTheme,
  ThemeProvider,
  PaletteMode
} from "@mui/material";

function App() {
  const [mode,] = React.useState<PaletteMode>('light');
  const defaultTheme = createTheme({
    palette: { mode },
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
              '& .MuiOutlinedInput-notchedOutline': {
              },
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

  return (
    <div className="App" style={{ overflow: 'none' }}>
      <ThemeProvider theme={defaultTheme}>
        <Header />
        <CssBaseline />
        <Formulario />
      </ThemeProvider>
    </div>
  );
}

export default App;
