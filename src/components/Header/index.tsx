import { useMediaQuery } from "@mui/material";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

const Header: React.FC = () => {

    const isMobile = useMediaQuery('(max-width:899px)');

    return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
}

export default Header;