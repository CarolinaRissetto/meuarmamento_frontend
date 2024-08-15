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
import { apiRequest } from '../components/services/apiService';

export default function Formulario() {

  const [uuid, setUuid] = useState<string | null>(null);
  const [documentosCriados, _] = useState<number>(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [sectionVisibility, setSectionVisibility] = React.useState({
    dadosPessoais: true,
    endereco: true,
    documentosParaAssinar: true,
  });

  const limparLocalStorage = useCallback(() => {
    for (const key in localStorage) {
      if (key.startsWith('form-data-')) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  const atualizaUrlELocalStorage = useCallback((uuid: string) => {
    localStorage.setItem('user-uuid', uuid);
    const urlParams = new URLSearchParams(location.search);
    if (!urlParams.has('uuid') || urlParams.get('uuid') !== uuid) {
      urlParams.set('uuid', uuid);
      navigate(`?${urlParams.toString()}`, { replace: true });
    }
  }, [navigate, location]);

  const buscarDados = useCallback(async (uuid: string) => {
    const response = await apiRequest({
      tipo: "buscaDados",
      data: {
        uuid
      }
    });
    if (response) {
      const parsedData = typeof response === 'string' ? JSON.parse(response) : response;
      console.log(parsedData);
      setFormData(parsedData);
      localStorage.setItem(`form-data-${uuid}`, JSON.stringify(parsedData));
    }
  }, []);

  useEffect(() => {
    const limparDadosAntigos = (uuidAtual: string) => {
      for (const key in localStorage) {
        if (key.startsWith('form-data-') && key !== `form-data-${uuidAtual}`) {
          localStorage.removeItem(key);
        }
      }
    };

    const buscarDadosEAtualizarEstado = async () => {
      const urlParams = new URLSearchParams(location.search);
      const urlUuid = urlParams.get('uuid');
      const storedUuid = localStorage.getItem('user-uuid');

      if (urlUuid && urlUuid !== storedUuid) {
        limparDadosAntigos(urlUuid);
        setUuid(urlUuid);
        await buscarDados(urlUuid);
        atualizaUrlELocalStorage(urlUuid);
      } else if (storedUuid) {
        limparDadosAntigos(storedUuid);
        setUuid(storedUuid);
        await buscarDados(storedUuid);
        atualizaUrlELocalStorage(storedUuid);
      } else {
        const newUuid = nanoid(6);
        limparDadosAntigos(newUuid);
        setUuid(newUuid);
        await buscarDados(newUuid);
        atualizaUrlELocalStorage(newUuid);
      }
    };

    buscarDadosEAtualizarEstado();
  }, [location.search, buscarDados, atualizaUrlELocalStorage]);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (uuid) {
      localStorage.setItem(`form-data-${uuid}`, JSON.stringify({ uuid, ...updatedFormData }));
    }
  };

  const handleNovoCadastro = () => {
    limparLocalStorage();
    const newUuid = nanoid(6);
    localStorage.setItem('user-uuid', newUuid);
    setUuid(newUuid);
    setFormData({});
    localStorage.setItem(`form-data-${newUuid}`, JSON.stringify({ uuid: newUuid, ...formData }));

    urlParams.set('uuid', newUuid);
    navigate(`?${urlParams.toString()}`, { replace: true });
  };


  const handleButtonComoFunciona = async () => {
    try {
      const response = await axios.get('https://jd5ueykib6.execute-api.us-east-1.amazonaws.com/default/testeFunction');
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSecaoPreenchida = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const handleAlternarVisibilidade = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const handleInputBlur = (tipo: string) => async (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (uuid) {
      localStorage.setItem(`form-data-${uuid}`, JSON.stringify({ uuid, ...updatedFormData }));
      await apiRequest({
        tipo,
        data: {
          uuid,
          ...updatedFormData,
        },
      });
    }
  };

  const [mode,] = React.useState<PaletteMode>('light');
  const defaultTheme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={defaultTheme}>

      <BarraDeNavegacao />

      <CssBaseline />

      <Grid container sx={{ height: "100vh", overflow: "hidden", paddingTop: { xs: '300px', sm: '270px', md: '145px' } }}>

        <BarraLateral documentos={documentosCriados} uuid={uuid} handleButtonComoFuncionaClick={handleButtonComoFunciona} />

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
              onToggle={() => handleAlternarVisibilidade('dadosPessoais')}
              onFilled={() => handleSecaoPreenchida('dadosPessoais')}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur('dadosPessoais')}
              formData={formData}
              uuid={uuid}
            />

            <Endereco
              isVisible={sectionVisibility.endereco}
              onToggle={() => handleAlternarVisibilidade('endereco')}
              onFilled={() => handleSecaoPreenchida('endereco')}
              setFormData={setFormData}
              formData={formData}
              uuid={uuid}
            />

            <DocumentosParaAssinar />

          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "55%", marginBottom: "20px" }}
          >
            <Button
              onClick={handleNovoCadastro}
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