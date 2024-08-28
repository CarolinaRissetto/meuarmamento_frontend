import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Button
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import axios from 'axios';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import DocumentosParaAssinar from './DocumentosParaAssinar';
import StepConnector from '@mui/material/StepConnector';

interface SideBarProps {
  uuid: string | null;
  handleButtonComoFuncionaClick: () => void;
  pdfUrls: { [key: string]: string | null };
  activeStep: number;
}

const SideBar: React.FC<SideBarProps> = ({ uuid, pdfUrls, activeStep }) => {
  const handleButtonComoFunciona = async () => {
    try {
      const response = await axios.get('https://jd5ueykib6.execute-api.us-east-1.amazonaws.com/default/testeFunction');
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
//step de acoro com preenchimento do form

  const documentosGerados = pdfUrls ? Object.values(pdfUrls).filter((url) => url !== null).length : 0;

  const stepLabelStyles = {
    '& .MuiStepLabel-label': {
      fontSize: '1.2rem',
    },
    '& .MuiStepIcon-root': {
      fontSize: '2rem',
      // color: '#549F5E', // Define a cor verde para os ícones dos steps
      '&.Mui-completed': {
        color: '#549F5E', // Mantém a cor verde quando o step estiver completo
      },
      '&.Mui-active': {
        color: '#549F5E', // Mantém a cor verde quando o step estiver ativo
      }
    }
  };

  const stepContentStyles = {
    '& .MuiTypography-root': { fontSize: '0.9rem' },
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
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={
            <StepConnector
              sx={{
                '& .MuiStepConnector-line': {
                  color: '#549F5E',
                  // borderColor: '#549F5E',
                  height: '100%'         
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
