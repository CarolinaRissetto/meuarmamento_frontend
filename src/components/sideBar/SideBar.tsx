import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Button
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from 'axios';
import StepperDesktop from '../stepper/StepperDesktop'

interface StepContentProps {
  label: string;
  description: string;
  content?: React.ReactNode;
}

interface SideBarProps {
  activeStep: number;
  steps: StepContentProps[];
}

const SideBar: React.FC<SideBarProps> = ({ activeStep, steps }) => {

  const handleButtonComoFunciona = async () => {
    try {
      const response = await axios.get('https://jd5ueykib6.execute-api.us-east-1.amazonaws.com/default/testeFunction');
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
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
        justifyContent: "center",
        alignItems: "start",
        pt: 4,
        px: 10,
        gap: 4,
        position: "sticky",
        top: '0',
        maxHeight: '100%',
      }}
    >

      <Box>
        <StepperDesktop activeStep={activeStep} steps={steps} />
      </Box>

      <Typography variant="overline" sx={{ fontSize: '0.8rem' }} >
        {`Custo para geração desses documentos: `}
        <Box component="strong" sx={{ color: 'text.primary', textDecoration: 'line-through' }}>
          R$ 0,00
        </Box>
      </Typography>
    </Grid>
  );
};

export default SideBar;