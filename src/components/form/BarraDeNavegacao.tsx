import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar
} from "@mui/material";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HomeIcon from "@mui/icons-material/Home";
import logo from "../../assets/images/logo-libera-defesa.png";

const BarraDeNavegacao: React.FC = () => {
  return (
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
        <Box sx={{ display: "flex", alignItems: "center" }} />
        <Avatar
          alt="Logo"
          src={logo}
          sx={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
          }}
        />
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
  );
};

export default BarraDeNavegacao;
