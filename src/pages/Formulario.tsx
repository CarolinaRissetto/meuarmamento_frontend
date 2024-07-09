import * as React from "react";
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

import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import logo from "./logo-libera-defesa.png"
import IconeCac from "./icone-cac.png";
import DadosPessoais from "../components/form/DadosPessoais"
import Endereco from "../components/form/Endereco"
import DocumentosParaAssinar from "../components/form/DocumentosParaAssinar"

const logoStyle = {
  width: "140px",
  height: "56px",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function Checkout() {

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
      <AppBar position="static">
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
              display: { xs: 'none', md: 'none', lg: 'none' } // Aqui escondemos a linha em telas pequenas e médias
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
      <CssBaseline />
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
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
              variant="contained"
              color="primary"
              href="#"
              startIcon={<PlayArrowIcon />}
              sx={{ marginTop: "20px" }}
            >
              Como funciona
            </Button>
          </Box>
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
            />
            <Endereco
              isVisible={sectionVisibility.endereco}
              onToggle={() => handleToggle('dadosPessoais')}
              onFilled={() => handleSectionFilled('dadosPessoais')}
            />

            <DocumentosParaAssinar />
          </Box>
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}