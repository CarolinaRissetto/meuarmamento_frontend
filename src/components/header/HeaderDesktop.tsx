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

const HeaderDesktop: React.FC = () => {

  return (
    <AppBar className="mui-fixed" position="fixed" elevation={0} sx={{ borderBottom: "0.4px solid #E3DFDC" }}>
      <Toolbar
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "200px",
          height: "auto",
          backgroundColor: "#F3F0EE",
          position: "relative",
          padding: { xs: 1, md: '27px' },
          "&::after": {
            content: '""',
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "1px",
            display: { xs: 'none', md: 'none', lg: 'none' }
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", margin: "35px" }} />
        <Avatar
          alt="Logo"
          src={logo}
          sx={{
            width: "90px",
            height: "90px",
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
              fontWeight: "bold"
            }}
          >
            Processo de Aquisição de Arma de Fogo
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center" }}>
          <Button
            component="a"
            href="https://liberadefesa-com-br.webflow.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
            startIcon={<AssignmentTurnedInIcon />}
            sx={{ color: "black", marginRight: "35px", marginBottom: { xs: "8px", md: 0 } }}
          >
            Serviços
          </Button>
          <Button color="inherit" startIcon={<HomeIcon />} sx={{ color: "black", marginRight: "40px" }}>
            Página Inicial
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderDesktop;
