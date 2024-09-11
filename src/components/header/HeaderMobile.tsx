import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import logo from "../../assets/images/logo-libera-defesa.png";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import FileCopyIcon from '@mui/icons-material/FileCopy';

function HeaderMobile() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{
            backgroundColor: "#F3F0EE",
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Avatar
                        alt="Logo"
                        src={logo}
                        sx={{
                            width: "65px",
                            height: "65px",
                            objectFit: "contain",
                        }}
                    />
                    <Typography
                        margin={"30px"}
                        variant="h4"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            textAlign: 'center',
                            fontFamily: "Raleway, sans-serif",
                            color: "black",
                            fontSize: { xs: "1.2rem", md: "1.5rem" },
                            fontWeight: "bold"
                        }}
                    >
                        Processo de Aquisição de Arma de Fogo
                    </Typography>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{ color: "black" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <a href="https://liberadefesa-com-br.webflow.io/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <AssignmentTurnedInIcon sx={{ marginRight: 1, color: "black" }} /> 
                                    <Typography sx={{ textAlign: 'center', color: "black" }}>Serviços</Typography>
                                </MenuItem>
                            </a>

                            <MenuItem onClick={handleCloseNavMenu}>
                                <HomeIcon sx={{ marginRight: 1, color: "black" }} /> 
                                <Typography sx={{ textAlign: 'center' }}>Página Inicial</Typography>
                            </MenuItem>

                            <MenuItem onClick={handleCloseNavMenu} >
                                <FileCopyIcon sx={{ marginRight: 1, color: "black" }} />
                                <Typography sx={{ textAlign: 'center' }}>Copiar Url</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default HeaderMobile;
