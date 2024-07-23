import React, { useEffect, useState } from 'react';
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
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import logo from "./logo-libera-defesa.png"
import IconeCac from "./icone-cac.png";
import DadosPessoais from "../components/form/DadosPessoais"
import Endereco from "../components/form/Endereco"
import DocumentosParaAssinar from "../components/form/DocumentosParaAssinar"
import axios from 'axios';


const logoStyle = {
  width: "140px",
  height: "56px",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function Checkout() {

  const [uuid, setUuid] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Verifica se já existe um UUID curto no localStorage
    const storedUuid = localStorage.getItem('user-uuid');
    if (storedUuid) {
      setUuid(storedUuid);
      const storedFormData = localStorage.getItem(`form-data-${storedUuid}`);
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }
    } else {
      // Se não houver UUID, gera um novo curto e armazena
      const newUuid = nanoid(6); // Gera um ID curto com 10 caracteres
      localStorage.setItem('user-uuid', newUuid);
      setUuid(newUuid);
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (uuid) {
      localStorage.setItem(`form-data-${uuid}`, JSON.stringify(updatedFormData));
    }
  };


  const handleNewRegistration = () => {
    // Gera um novo UUID e limpa os dados do formulário
    const newUuid = nanoid(6);
    localStorage.setItem('user-uuid', newUuid);
    setUuid(newUuid);
    setFormData({});
    localStorage.removeItem(`form-data-${uuid}`);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário junto com o UUID curto
    console.log('UUID:', uuid, 'Form Data:', formData);
    // Enviar para o backend...
  };





  const handleButtonClick = async () => {
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
      [getNextSection(section)]: true,
    }));
  };

  const handleToggle = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const getNextSection = (currentSection: string) => {
    switch (currentSection) {
      case "dadosPessoais":
        return "endereco";
      case "endereco":
        return "documentosParaAssinar";
      default:
        return "";
    }
  };

  const [mode, setMode] = React.useState<PaletteMode>('light');
  const defaultTheme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar className="mui-fixed" position="fixed">
        <Toolbar
          sx={{
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "300px",
            height: "6vw",
            backgroundColor: "#F3F0EE",
            position: "relative",
            padding: { xs: 1, md: '45px' },
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
              sx={{ fontFamily: "Raleway, sans-serif", color: "black", fontSize: { xs: "1.2rem", md: "1.5rem" } }}
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
      <Toolbar sx={{ height: "6vw" }} /> {/* Adiciona um espaço equivalente ao Toolbar para ajuste do position fixed */}
      <Box sx={{ paddingTop: { xs: '250px', sm: '0', md: '0' } }} />

      <CssBaseline />
      <Grid container sx={{ minHeight: "100vh" }}>
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
            top: '6vw',
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "20px",
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
              4
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
              1
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
              onClick={handleButtonClick}
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
            maxWidth: "100%",
            width: "100%",
            backgroundColor: "#F3F0EE",
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
              onToggle={() => handleToggle('dadosPessoais')}
              onFilled={() => handleSectionFilled('dadosPessoais')}
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
            <Button
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              sx={{
                width: { xs: "100%", sm: "fit-content" },
                mt: 2, // Ajuste conforme necessário para aproximar do formulário
              }}
            >
              Finalizar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider >
  );
}