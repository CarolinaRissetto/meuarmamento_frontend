import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Box,
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
  PaletteMode
} from "@mui/material";
import { nanoid } from 'nanoid';

import DadosPessoais from "../components/form/DadosPessoais"
import Endereco from "../components/form/Endereco"
import DocumentosParaAssinar from "../components/form/DocumentosParaAssinar"
import axios from 'axios';
import BarraDeNavegacao from '../components/form/BarraDeNavegacao';
import BarraLateral from '../components/form/BarraLateral';

export default function Formulario() {

  const [uuid, setUuid] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<number>(0);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const buscarDados = async (uuid: string) => {
    try {
      const response = await axios.get(`http://localhost:3010/processos/buscaDados`, {
        params: {
          tipo: 'buscaDados',
          uuid: uuid
        }
      });

      if (response.data) {
        setFormData(response.data);
        console.log(response.data)
        localStorage.setItem(`form-data-${uuid}`, JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  useEffect(() => {
    const buscarDadosEAtualizarEstado = async () => {

      const storedUuid = localStorage.getItem('user-uuid');

      if (storedUuid) {
        setUuid(storedUuid);
        await buscarDados(storedUuid); // Buscar dados do cliente no banco de dados
        if (!urlParams.has('uuid')) {
          urlParams.set('uuid', storedUuid);
          navigate(`?${urlParams.toString()}`, { replace: true });
        }
      } else {
        const newUuid = nanoid(6);
        localStorage.setItem('user-uuid', newUuid);
        setUuid(newUuid);
        await buscarDados(newUuid); // Buscar dados para o novo UUID
        urlParams.set('uuid', newUuid);
        navigate(`?${urlParams.toString()}`, { replace: true });
      }
    }
    buscarDadosEAtualizarEstado();
  }, [location, navigate, urlParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (uuid) {
      localStorage.setItem(`form-data-${uuid}`, JSON.stringify(updatedFormData));
    }
  };

  const handleNewRegistration = () => {
    const newUuid = nanoid(6);
    localStorage.setItem('user-uuid', newUuid);
    setUuid(newUuid);
    setFormData({});
    localStorage.removeItem(`form-data-${uuid}`);

    urlParams.set('uuid', newUuid);
    navigate(`?${urlParams.toString()}`, { replace: true });
  };

  const handleButtonComoFuncionaClick = async () => {
    try {
      const response = await axios.get('https://jd5ueykib6.execute-api.us-east-1.amazonaws.com/default/testeFunction');
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const [sectionVisibility, setSectionVisibility] = React.useState({
    dadosPessoais: true,
    endereco: true,
    documentosParaAssinar: true,
  });

  const handleSectionFilled = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const handleToggle = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const [mode,] = React.useState<PaletteMode>('light');
  const defaultTheme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={defaultTheme}>

      <BarraDeNavegacao />

      <CssBaseline />

      <Grid container sx={{ height: "100vh", overflow: "hidden", paddingTop: { xs: '300px', sm: '270px', md: '145px' } }}>
        
        <BarraLateral documentos={documentos} uuid={uuid} handleButtonComoFuncionaClick={handleButtonComoFuncionaClick} />

        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "auto",
            width: "100%",
            maxHeight: "85vh",
            backgroundColor: "#F3F0EE",
            overflowY: "scroll",
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <DadosPessoais
              isVisible={sectionVisibility.dadosPessoais}
              onToggle={() => handleToggle('dadosPessoais')}
              onFilled={() => handleSectionFilled('dadosPessoais')}
              handleInputChange={handleInputChange}
              formData={formData}
              uuid={uuid}
            />
            <Endereco
              isVisible={sectionVisibility.endereco}
              onToggle={() => handleToggle('endereco')}
              onFilled={() => handleSectionFilled('endereco')}
              handleInputChange={handleInputChange}
              formData={formData}
              uuid={uuid}
            />

            <DocumentosParaAssinar />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "55%", marginBottom: "20px" }}
          >
            <Button
              onClick={handleNewRegistration}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "fit-content" },
                mt: 2,
              }}
            >
              Novo Cadastro
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider >
  );
}
