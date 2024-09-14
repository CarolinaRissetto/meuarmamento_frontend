import React from 'react';
import Cadastro from './pages/autorizacaoArma'
import "./styles/styles.css";
import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import defaultTheme from './styles/theme'
import Header from './components/Header';
import AutorizacaoArma2 from './pages/AutorizacaoArma2';

function App() {
  return (
    <div className="App" style={{ overflow: 'none' }}>
      <ThemeProvider theme={defaultTheme}>
        <Header />
        <CssBaseline />
        {/* <Cadastro /> */}
        <AutorizacaoArma2 />
      </ThemeProvider>
    </div>
  );
}

export default App;
