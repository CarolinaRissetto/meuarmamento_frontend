import React from 'react';
import {
  Grid,
  Box,
  Typography,
} from "@mui/material";
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