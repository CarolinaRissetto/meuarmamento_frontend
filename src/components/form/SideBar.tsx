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
import DocumentosParaAssinar from './DocumentosParaAssinar';

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
      
      <Box>
        <Stepper activeStep={activeStep} orientation="vertical">      

          <Step>
            <StepLabel>
              Dados pessoais
            </StepLabel>
            <StepContent>
              <Typography>Primeira etapa necessária para geração de diversos documentos</Typography>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>
            Endereço
            </StepLabel>
            <StepContent>
              <Typography>Dados referente ao seu endereço</Typography>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>
              Documentos já concluídos ({documentosGerados})
            </StepLabel>
            <StepContent>
              <DocumentosParaAssinar urls={pdfUrls} fullView={false} />            
            </StepContent>
          </Step>
          
        </Stepper>
      </Box>

      <Typography variant="overline" sx={{ color: 'text.secondary', mt: 0.5 }}>
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
      <div>
        Seu ID: {uuid}
      </div>
      
    </Grid>
  );
};

export default SideBar;
