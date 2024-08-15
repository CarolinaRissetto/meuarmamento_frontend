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

interface BarraLateralProps {
  documentos: number;
  uuid: string | null;
  handleButtonComoFuncionaClick: () => void;
}

const BarraLateral: React.FC<BarraLateralProps> = ({ documentos, uuid }) => {

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
          Seu Processo CAC Simplificado
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ marginBottom: "10px" }}>
        Número de documentos que serão gerados automaticamente com esses
        dados:
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
          3
        </Typography>
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
          {documentos}
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

export default BarraLateral;
