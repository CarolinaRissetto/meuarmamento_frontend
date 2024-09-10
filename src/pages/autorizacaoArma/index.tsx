import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import DadosPessoais from "./sections/DadosPessoais";
import Endereco from "./sections/Endereco";
import DocumentosParaAssinar from "./sections/DocumentosParaAssinar";
import axios from "axios";
import SideBar from "../../components/sideBar/SideBar";
import { apiRequest } from "../../services/api/apiRequestService";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useMediaQuery } from '@mui/material';
import StepperMobile from '../../components/stepper/StepperMobile'

export default function Cadastro() {
  const [uuid, setUuid] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const [sectionVisibility, setSectionVisibility] = React.useState({
    dadosPessoais: true,
    endereco: true,
    documentosParaAssinar: true,
  });
  const [pdfUrls, setPdfUrls] = useState<{ [key: string]: string | null }>({});
  const [buttonText, setButtonText] = useState("Clique para copiar sua url");
  const [activeStep, setActiveStep] = React.useState<number>(0);

  const limparLocalStorage = useCallback((newUuid: string) => {
    for (const key in localStorage) {
      if (key.startsWith("form-data-") && key !== `form-data-${newUuid}`) {
        localStorage.removeItem(key);
      }
    }
  }, []);

  const atualizaUrlELocalStorage = useCallback(
    (uuid: string) => {
      localStorage.setItem("user-uuid", uuid);
      const urlParams = new URLSearchParams(location.search);
      if (!urlParams.has("uuid") || urlParams.get("uuid") !== uuid) {
        urlParams.set("uuid", uuid);
        navigate(`?${urlParams.toString()}`, { replace: true });
      }
    },
    [navigate, location]
  );

  const buscarDados = useCallback(async (uuid: string) => {
    const response = await apiRequest({
      tipo: "buscaDados",
      data: {
        uuid,
      },
    });

    if (response) {
      try {
        const parsedData = typeof response === "string" ? JSON.parse(response) : response;
        console.log(parsedData);
        setFormData(parsedData);
        setPdfUrls(parsedData.documentos);
        localStorage.setItem(`form-data-${uuid}`, JSON.stringify(parsedData));

        const initialActiveStep = parsedData.documentos && Object.keys(parsedData.documentos).length > 0 ? 2 : 0;
        setActiveStep(initialActiveStep);

      } catch (error) {
        console.error("Erro ao fazer o parse do JSON:", error);
        return; 
      }
    }
  }, []);

  useEffect(() => {
    const limparDadosAntigos = (uuidAtual: string) => {
      for (const key in localStorage) {
        if (key.startsWith("form-data-") && key !== `form-data-${uuidAtual}`) {
          localStorage.removeItem(key);
        }
      }
    };

    const buscarDadosEAtualizarEstado = async () => {
      const urlParams = new URLSearchParams(location.search);
      const urlUuid = urlParams.get("uuid");
      const storedUuid = localStorage.getItem("user-uuid");

      if (urlUuid && urlUuid !== storedUuid) {
        limparDadosAntigos(urlUuid);
        setUuid(urlUuid);
        await buscarDados(urlUuid);
        atualizaUrlELocalStorage(urlUuid);
      } else if (storedUuid) {
        limparDadosAntigos(storedUuid);
        setUuid(storedUuid);
        await buscarDados(storedUuid);
        atualizaUrlELocalStorage(storedUuid);
      } else {
        const newUuid = nanoid(6);
        limparDadosAntigos(newUuid);
        setUuid(newUuid);
        await buscarDados(newUuid);
        atualizaUrlELocalStorage(newUuid);
      }
    };

    buscarDadosEAtualizarEstado();
  }, [location.search, buscarDados, atualizaUrlELocalStorage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    if (uuid) {
      localStorage.setItem(
        `form-data-${uuid}`,
        JSON.stringify({ uuid, ...updatedFormData })
      );
    }
  };

  const handleNovoCadastro = () => {
    console.log("Botão de novo cadastro clicado");

    const newUuid = nanoid(6);
    limparLocalStorage(newUuid);
    localStorage.setItem("user-uuid", newUuid);
    setUuid(newUuid);
    setFormData({});
    setPdfUrls({});
    setActiveStep(0);

    localStorage.setItem(
      `form-data-${newUuid}`,
      JSON.stringify({ uuid: newUuid, ...formData })
    );

    urlParams.set("uuid", newUuid);
    navigate(`?${urlParams.toString()}`, { replace: true });
  };

  const handleButtonComoFunciona = async () => {
    try {
      const response = await axios.get(
        "https://jd5ueykib6.execute-api.us-east-1.amazonaws.com/default/testeFunction"
      );
      console.log(response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleSecaoPreenchida = async (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const handleAlternarVisibilidade = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const handleInputBlur =
    (tipo: string) => async (event: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const updatedFormData = { ...formData, [name]: value };
      setFormData(updatedFormData);

      if (uuid) {
        localStorage.setItem(
          `form-data-${uuid}`,
          JSON.stringify({ uuid, ...updatedFormData })
        );
        await apiRequest({
          tipo,
          data: {
            uuid,
            ...updatedFormData,
          },
        });
      }
    };

  const handleCopyClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setButtonText("Url copiada!");
      setTimeout(() => {
        setButtonText("Clique para copiar sua url");
      }, 3000);
    }).catch(err => {
      console.error("Erro ao copiar ID: ", err);
    });
  };

  const isScreenSmall = useMediaQuery('(max-width:1500px)');
  const isExtraSmallScreen = useMediaQuery('(max-width:899px)');
  const steps = ['Dados pessoais', 'Endereço', 'Documentos já concluídos'];
  const buttonRef = useRef(null);

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        paddingTop: { xs: "0px", sm: "0px", md: "145px" },

        "@media (max-width: 1087px) and (min-width: 899px)": {
          paddingTop: "175px",
        },
      }}
    >

      <SideBar
        uuid={uuid}
        handleButtonComoFuncionaClick={handleButtonComoFunciona}
        pdfUrls={pdfUrls}
        activeStep={activeStep}
        onClick={handleCopyClick}
      />

      <Grid
        item
        sm={12}
        md={7}
        lg={8}
        sx={{
          display: "flex",
          paddingTop: '0 !important',
          flexDirection: "column",
          maxWidth: "auto",
          width: "100%",
          maxHeight: { xs: "100vh", md: "85vh" },
          backgroundColor: "#F3F0EE",
          overflowY: "scroll",
          alignItems: "start",
          pt: { xs: 2, sm: 2 },
          px: { xs: 2, sm: 10 },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: { sm: "100%", md: 600 },
          }}
        >

          {isExtraSmallScreen && (

            <StepperMobile activeStep={activeStep} />

          )}

          <DadosPessoais
            isVisible={sectionVisibility.dadosPessoais}
            onToggle={() => handleAlternarVisibilidade("dadosPessoais")}
            onFilled={() => handleSecaoPreenchida("dadosPessoais")}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur("dadosPessoais")}
            formData={formData}
            setPdfUrls={setPdfUrls}
            uuid={uuid}
            setActiveStep={setActiveStep}
          />

          <Endereco
            isVisible={sectionVisibility.endereco}
            onToggle={() => handleAlternarVisibilidade("endereco")}
            onFilled={() => handleSecaoPreenchida("endereco")}
            setFormData={setFormData}
            setPdfUrls={setPdfUrls}
            formData={formData}
            uuid={uuid}
            setActiveStep={setActiveStep}
          />

          <Grid item xs={12} sx={{ padding: '10px', paddingBottom: 0 }}>

            <Typography variant="h5" component="h2" color={"#1465C0"} align='center'>
              Documentos Gerados
            </Typography>

            <DocumentosParaAssinar urls={pdfUrls} />

          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "55%",
            marginBottom: {
              xs: "70%",
              sm: "30%",
              md: "30%",
              lg: "10%",
              xl: "10%",
            },
          }}
        >
          <Button
            ref={buttonRef}
            onClick={(event) => {
              event.stopPropagation(); // Impede que o clique seja capturado como clique fora
              handleNovoCadastro();
            }}
            variant="contained"
            sx={{
              width: { xs: "100%", sm: "fit-content" },
              mt: 2,
            }}
          >
            Novo Cadastro
          </Button>
        </Box>

        <Box
          sx={{
            width: "275px",
            position: "fixed",
            top: "20%",
            right: "2%",
            zIndex: 2000,
            paddingTop: { xs: "90px", sm: "55px", md: "0%", lg: "0%" },
          }}
        >

          {isScreenSmall && !isExtraSmallScreen ? (
            <Button size="small" onClick={handleCopyClick} sx={{
              backgroundColor: 'white',
              marginLeft: 'auto',
              display: 'block',
              width: '120px',
            }}>{buttonText}</Button>

          ) : !isScreenSmall ? (
            < Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography padding={2}>
                    Salve seu formulário
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Copie sua url para retornar ao seu cadastro quando quiser.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button size="small" onClick={handleCopyClick}>{buttonText}</Button>
              </CardActions>
            </Card>
          ) : null}
        </Box>

      </Grid>
    </Grid >
  );
}