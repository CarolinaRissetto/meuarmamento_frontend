import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import logo from "../../assets/images/logo_medium_no_backgroud.png";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import FileCopyIcon from "@mui/icons-material/FileCopy";

function HeaderMobile() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const [isCopied, setIsCopied] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#F3F0EE",
        marginTop: "8px",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            component="img"
            alt="Logo"
            src={logo}
            sx={{
              height: "auto",
              width: "auto",
              maxHeight: "65px",
              maxWidth: "65px",
              objectFit: "contain",
              flexShrink: 0,
            }}
          />

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontFamily: "Raleway, sans-serif",
              color: "#211f50",
              fontSize: { xs: "1.35rem", md: "1.5rem" },
              fontWeight: "bold",
              marginLeft: 2,
              marginTop: "8px",
              marginBottom: "8px",
            }}
          >
            Processo de Aquisição de Arma de Fogo
          </Typography>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#211f50" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem
                component="a"
                href="https://meuarmamento.webflow.io/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCloseNavMenu}
                sx={{ display: 'none', textDecoration: "none", color: "#211f50" }}
              >
                <AssignmentTurnedInIcon
                  sx={{ marginRight: 1, color: "#211f50" }}
                />
                <Typography sx={{ textAlign: "center", color: "#211f50" }}>
                  Serviços
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}
                sx={{ display: 'none' }}
              >
                <HomeIcon sx={{ marginRight: 1, color: "#211f50" }} />
                <Typography sx={{ textAlign: "center", color: "#211f50" }}>
                  Página Inicial
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCopyClick}>
                <FileCopyIcon sx={{ marginRight: 1, color: "#211f50" }} />
                <Typography sx={{ textAlign: "center", color: "#211f50" }}>
                  {isCopied ? "Copiado" : "Copiar URL"}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HeaderMobile;
