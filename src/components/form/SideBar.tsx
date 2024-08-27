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
import DocumentosParaAssinar from './DocumentosParaAssinar';
import StepConnector from '@mui/material/StepConnector';

const steps = [

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

  const [activeStep, setActiveStep] = React.useState(2);

  const stepLabelStyles = {
    '& .MuiStepLabel-label': {
      fontSize: '1.2rem',
      paddingBottom: '16px' // Aumenta o espaço entre os labels
    },
    '& .MuiStepIcon-root': {
      fontSize: '2rem',
      color: '#549F5E', // Define a cor verde para os ícones dos steps
      '&.Mui-completed': {
        color: '#549F5E', // Mantém a cor verde quando o step estiver completo
      },
      '&.Mui-active': {
        color: '#549F5E', // Mantém a cor verde quando o step estiver ativo
      }
    }
  };

  const stepContentStyles = {
    '& .MuiTypography-root': { fontSize: '1rem' },
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
        justifyContent: "center",  // Centraliza horizontalmente
        alignItems: "start",
        pt: 4,
        px: 10,
        gap: 4,
        position: "sticky",
        top: '0',
        maxHeight: '100%',
      }}
    >
      {/* <Box
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
      </Box> */}

      <Box>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={
            <StepConnector
              sx={{
                '& .MuiStepConnector-line': {
                  borderColor: '#549F5E',  // Cor do conector
                  borderWidth: '2px',    // Espessura do conector
                  minHeight: '40px',     // Altura mínima do conector
                  height: '100%'         // Faz com que o conector ocupe toda a altura disponível
                },
              }}
            />
          }
        >
          <Step>
            <StepLabel sx={stepLabelStyles}>
              Dados pessoais
            </StepLabel>
            <StepContent sx={stepContentStyles}>
              <Typography>Primeira etapa necessária para geração de diversos documentos</Typography>
            </StepContent>
          </Step>

          <Step>
            <StepLabel sx={stepLabelStyles}>
              Endereço
            </StepLabel>
            <StepContent sx={stepContentStyles}>
              <Typography>Dados referente ao seu endereço</Typography>
            </StepContent>
          </Step>

          <Step>
            <StepLabel sx={stepLabelStyles}>
              Documentos já concluídos ({documentosGerados})
            </StepLabel>
            <StepContent sx={stepContentStyles}>
              <DocumentosParaAssinar urls={pdfUrls} fullView={false} />
            </StepContent>
          </Step>

        </Stepper>
      </Box>

      <Typography variant="overline" sx={stepContentStyles} >
        {`Custo para geração desses documentos: `}
        <Box component="strong" sx={{ color: 'text.primary', textDecoration: 'line-through' }}>
          R$ 0,00
        </Box>
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
    </Grid>
  );
};

export default SideBar;
