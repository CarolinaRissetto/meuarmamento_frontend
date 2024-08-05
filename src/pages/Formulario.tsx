import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  CssBaseline,
  Grid,
  ThemeProvider,
  createTheme,
  PaletteMode
} from "@mui/material";
import { nanoid } from 'nanoid';
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import logo from "./logo-libera-defesa.png"
import IconeCac from "./icone-cac.png";
import DadosPessoais from "../components/form/DadosPessoais"
import Endereco from "../components/form/Endereco"
import DocumentosParaAssinar from "../components/form/DocumentosParaAssinar"
import axios from 'axios';

export default function Checkout() {

  const [uuid, setUuid] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<number>(0);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const storedUuid = localStorage.getItem('user-uuid');

    if (storedUuid) {
      setUuid(storedUuid);
      const storedFormData = localStorage.getItem(`form-data-${storedUuid}`);
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }
      if (!urlParams.has('uuid')) {
        urlParams.set('uuid', storedUuid);
        navigate(`?${urlParams.toString()}`, { replace: true });
      }
    } else {
      const newUuid = nanoid(6); 
      localStorage.setItem('user-uuid', newUuid);
      setUuid(newUuid);
      urlParams.set('uuid', newUuid);
      navigate(`?${urlParams.toString()}`, { replace: true });
    }
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
      <AppBar className="mui-fixed" position="fixed">
        <Toolbar
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "200px",
            height: "auto",
            backgroundColor: "#F3F0EE",
            position: "relative",
            padding: { xs: 1, md: '25px' },
            borderBottom: "1px solid #cccccc",
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "1px",
              backgroundColor: "#cccccc",
              display: { xs: 'none', md: 'none', lg: 'none' }
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          />
          <Avatar
            alt="Logo"
            src={logo}
            sx={{
              width: "80px",
              height: "80px",
              objectFit: "contain",
            }}
          />

          {/* Título Centralizado */}
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography
              margin={"30px"}
              variant="h4"
              component="div"
              sx={{
                fontFamily: "Raleway, sans-serif",
                color: "black",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
              }}
            >
              Autorização de Aquisição de Armas de Fogo - PF
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center" }}>
            <a href="https://liberadefesa-com-br.webflow.io/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button
                color="inherit"
                startIcon={<AssignmentTurnedInIcon />}
                sx={{ color: "black", marginBottom: { xs: "8px", md: 0 } }}
              >
                Serviços
              </Button>
            </a>
            <Button color="inherit" startIcon={<HomeIcon />} sx={{ color: "black" }}>
              Página Inicial
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <CssBaseline />

      <Grid container sx={{ height: "100vh", overflow: "hidden", paddingTop: { xs: '300px', sm: '270px', md: '145px' } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "#E3DFDC",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
            position: "sticky",
            top: '0',
            maxHeight: '100%',
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "20px",
              position: 'sticky'
            }}
          >
            <Avatar
              alt="IconeCac"
              src={IconeCac}
              sx={{
                width: "70px",
                height: "70px",
                marginRight: "10px",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Montserrat, sans-serif", // Fonte Montserrat
                color: "black",
                textAlign: "center",
              }}
            >
              Seu Processo CAC Simplificado
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ marginBottom: "10px" }}>
            Número de documentos que serão gerados automaticamente com esses
            dados:
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#4caf50", textAlign: "center" }}
            >
              3
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ marginBottom: "10px" }}>
            Documentos já concluídos:
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: "10px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#4caf50", textAlign: "center" }}
            >
              {documentos}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "#4caf50",
              fontWeight: "bold",
              fontSize: "1.2rem",
              textAlign: "center",
            }}
          >
            Custo:{" "}
            <span style={{ color: "green", fontSize: "1.2rem" }}>
              Gratuito!
            </span>
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button
              onClick={handleButtonComoFuncionaClick}
              variant="contained"
              color="primary"
              href="#"
              startIcon={<PlayArrowIcon />}
              sx={{ marginTop: "20px" }}
            >
              Como funciona
            </Button>
          </Box>
          <div>
            Seu ID: {uuid}
          </div>
        </Grid>
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
