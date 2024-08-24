import React from 'react';
import {
  Grid,
  Box,
  Avatar,
  Typography,
  Button
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import IconeCac from "../../assets/images/icone-cac.png";
import axios from 'axios';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';

const steps = [
  {
    label: 'Dados pessoais',
    description: `Primeira etapa necessária para geração de diversos documentos`,    
  },
  {
    label: 'Endereço',
    description:
      'Dados referente ao seu endereço',
  },
  {
    label: 'Documentos já concluídos (0)',
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

interface SideBarProps {
  uuid: string | null;
  handleButtonComoFuncionaClick: () => void;
  pdfUrls: { [key: string]: string | null }; 
}

const SideBar: React.FC<SideBarProps> = ({ uuid, pdfUrls }) => {
  const handleButtonComoFunciona = async () => {
    try {
      const response = await axios.get('https://jd5ueykib6.execute-api.us-east-1.amazonaws.com/default/testeFunction');
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const documentosGerados = Object.values(pdfUrls).filter((url) => url !== null).length;

  const [activeStep, setActiveStep] = React.useState(3);

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
        alignItems: "start",
        pt: 4,
        px: 10,
        gap: 4,
        position: "sticky",
        top: '0',
        maxHeight: '100%',
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          marginTop: "20px",
          position: 'sticky'
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
            fontFamily: "Montserrat, sans-serif",
            color: "black",
            textAlign: "center",
          }}
        >
          Processo de Aquisição de Arma de Fogo
        </Typography>
      </Box>
      
      <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
        </Paper>
      )}
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
          {documentosGerados}
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
          onClick={handleButtonComoFunciona}
          variant="contained"
          color="primary"
          href="#"
          startIcon={<PlayArrowIcon />}
          sx={{ marginTop: "20px" }}
        >
          Como funciona
        </Button>
      </Box>
      <div>
        Seu ID: {uuid}
      </div>
    </Grid>
  );
};

export default SideBar;
