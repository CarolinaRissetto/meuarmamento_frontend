import React from 'react';
import AutorizacaoArma from './pages/autorizacaoArma'
import "./styles/styles.css";
import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import defaultTheme from './styles/theme'
import Header from './components/header/Header';
import { ProcessoProvider } from './pages/autorizacaoArma/sections/context/ProcessoContext'; 

function App() {
  return (
    <div className="App" style={{ overflow: 'none' }}>
      <ThemeProvider theme={defaultTheme}>
        <Header />
        <CssBaseline />
        <ProcessoProvider>
          <AutorizacaoArma />
        </ProcessoProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
