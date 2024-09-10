import React from 'react';
import Cadastro from './pages/Cadastro'
import "./styles/styles.css";
import HeaderDesktop from './components/HeaderDesktop';
import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import defaultTheme from './styles/theme'

function App() {
  return (
    <div className="App" style={{ overflow: 'none' }}>
      <ThemeProvider theme={defaultTheme}>
        <HeaderDesktop />
        <CssBaseline />
        <Cadastro />
      </ThemeProvider>
    </div>
  );
}

export default App;
