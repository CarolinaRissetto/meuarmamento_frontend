import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { nanoid } from "nanoid";
import DadosPessoais from "../components/form/DadosPessoais";
import Endereco from "../components/form/Endereco";
import DocumentosParaAssinar from "../components/form/DocumentosParaAssinar";
import axios from "axios";
import SideBar from "../components/form/SideBar";
import { apiRequest } from "../components/services/apiRequestService";
import SectionHeader from "../components/form/Cabecalho";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useMediaQuery } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

export default function Formulario() {
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

  useEffect(() => {
    const initialActiveStep = formData.documentos && Object.keys(formData.documentos).length > 0 ? 2 : 0;
    setActiveStep(initialActiveStep);
  }, [formData]);

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
      const parsedData =
        typeof response === "string" ? JSON.parse(response) : response;
      console.log(parsedData);
      setFormData(parsedData);
      setPdfUrls(parsedData.documentos);
      localStorage.setItem(`form-data-${uuid}`, JSON.stringify(parsedData));
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
    const newUuid = nanoid(6);
    limparLocalStorage(newUuid);
    localStorage.setItem("user-uuid", newUuid);
    setUuid(newUuid);
    setFormData({});
    setPdfUrls({});
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
  const isExtraSmallScreen = useMediaQuery('(max-width:900px)');
  const steps = ['Dados pessoais', 'Endereço', 'Documentos já concluídos'];

  return (
    <Grid
      container
      sx={{
        height: "100vh",
        paddingTop: { xs: "340px", sm: "330px", md: "145px" },
      }}
    >

      <SideBar
        uuid={uuid}
        handleButtonComoFuncionaClick={handleButtonComoFunciona}
        pdfUrls={pdfUrls}
        activeStep={activeStep}
      />

      <Grid
        item
        sm={12}
        md={7}
        lg={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "auto",
          width: "100%",
          maxHeight: { xs: "65vh", md: "85vh" },
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
            <Grid
              item
              xs={12}
              sx={{
                paddingBottom: 2,
                pt: { xs: '30px', sm: '20px' },
                width: '100%', 
                position: 'sticky', 
                top: '0', 
                zIndex: 1000, 
                backgroundColor: '#F3F0EE', 
                paddingLeft: { xs: 1, sm: 1 }, 
                paddingRight: { xs: 1, sm: 1 },
              }}
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
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

          <Grid item xs={12} sx={{ padding: '10px', paddingBottom:0 }}>
            <SectionHeader title="Documentos gerados" />

            <DocumentosParaAssinar urls={pdfUrls} />

          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "55%",
            marginBottom: "20px",
          }}
        >
          <Button
            onClick={handleNovoCadastro}
            variant="contained"
            sx={{
              marginBottom: '40px',
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

          {isScreenSmall ? (
            <Button size="small" onClick={handleCopyClick} sx={{
              backgroundColor: 'white',
              marginLeft: 'auto',
              display: 'block', 
              width: '120px',
            }}>{buttonText}</Button>

          ) : (
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
          )}
        </Box>

      </Grid>
    </Grid >
  );
}