import * as React from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Avatar, PaletteMode, Toolbar } from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import logo from "./logo-libera-defesa.png"
import IconeCac from "./icone-cac.png";
import DadosPessoais from "../components/form/DadosPessoais"

const steps = ["Shipping address", "Payment details", "Review your order"];

const logoStyle = {
  width: "140px",
  height: "56px",
  marginLeft: "-4px",
  marginRight: "-8px",
};

export default function Checkout() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar position="static">
        <Toolbar
          sx={{
            minHeight: "450px", // Ajuste a altura da Toolbar conforme necessário
            height: "6vw",
            backgroundColor: "#F3F0EE",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "1px",
              backgroundColor: "#cccccc", // Cor da linha
            },
          }}
        >
          {/* Logo */}
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
              marginRight: "10px",
              width: "80px",
              height: "80px",
              objectFit: "contain",
            }}
          />

          {/* Título Centralizado */}
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontFamily: "Raleway, sans-serif", color: "black" }}
            >
              Autorização de Aquisição de Armas de Fogo - PF
            </Typography>
          </Box>

          {/* Botão Página Inicial */}
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            sx={{ color: "black" }}
          >
            Página Inicial
          </Button>
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
            <DadosPessoais/>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: activeStep !== 0 ? "space-between" : "flex-end",
              alignItems: "end",
              gap: 1,
              pb: 0,
              mt: 0,
              mb: 0,
            }}
          >
            {activeStep !== 0 && (
              <Button
                startIcon={<ChevronLeftRoundedIcon />}
                onClick={handleBack}
                variant="text"
                sx={{
                  display: { xs: "none", sm: "flex" },
                }}
              >
                Previous
              </Button>
            )}
            {activeStep !== 0 && (
              <Button
                startIcon={<ChevronLeftRoundedIcon />}
                onClick={handleBack}
                variant="outlined"
                fullWidth
                sx={{
                  display: { xs: "flex", sm: "none" },
                }}
              >
                Previous
              </Button>
            )}
            <Button
              variant="contained"
              endIcon={<ChevronRightRoundedIcon />}
              onClick={handleNext}
              sx={{
                width: { xs: "100%", sm: "fit-content" },
                mt: 2, // Ajuste conforme necessário para aproximar do formulário
              }}
            >
              {activeStep === steps.length - 1 ? "Place order" : "Next"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}