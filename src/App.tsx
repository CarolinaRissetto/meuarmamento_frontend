import React from 'react';
import Formulario from './pages/Formulario'
import "./syles.css";
import Header from './components/form/Header';
import {
  CssBaseline,
  createTheme,
  ThemeProvider,
  PaletteMode
} from "@mui/material";

function App() {
  const [mode,] = React.useState<PaletteMode>('light');  
  const defaultTheme = createTheme({ palette: { mode } });

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
