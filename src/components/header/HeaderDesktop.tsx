import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import HomeIcon from "@mui/icons-material/Home";
import logo from "../../assets/images/logo_medium_no_backgroud.png";

const HeaderDesktop: React.FC = () => {
  return (
    <AppBar
      className="mui-fixed"
      position="fixed"
      elevation={0}
      sx={{ borderBottom: "0.4px solid #E3DFDC" }}
    >
      <Toolbar
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F3F0EE",
          position: "relative",
          paddingTop: { xs: 1, md: "27px" },
          paddingBottom: { xs: 1, md: "27px" },
          paddingLeft: { xs: "8px", md: "70px" },
          paddingRight: { xs: "8px", md: "70px" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            alt="Logo"
            src={logo}
            sx={{
              height: "auto",
              width: "auto",
              maxHeight: "90px",
              maxWidth: "90px",
              objectFit: "contain",
              marginLeft: "20px",
              marginRight: "30px",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontFamily: "Raleway, sans-serif",
              fontWeight: "bold",
              color: "#211f50",              
              minWidth: "330px",
              display: { xs: "none", lg: "block" }
            }}
          >
            Meu Armamento
          </Typography>
        </Box>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.7rem" },
            fontWeight: "bold",
            color: "#211f50",
            textAlign: "center",
          }}
        >
          Processo de Aquisição de Arma de Fogo
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            marginLeft: "20px",
          }}
        >
          <Button
            component="a"
            href="https://meuarmamento.webflow.io/"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<AssignmentTurnedInIcon sx={{ marginRight: 1, color: "#211f50" }} />}
            sx={{
              color: "#211f50",
              marginRight: { md: "35px" },
              marginBottom: { xs: "8px", md: 0 },
              textDecoration: "none",
            }}
          >
            Serviços
          </Button>
          <Button
            color="inherit"
            startIcon={<HomeIcon sx={{ marginRight: 1, color: "#211f50" }} />}
            sx={{ color: "#211f50", marginRight: { md: "20px" } }}
          >
            Página Inicial
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderDesktop;
