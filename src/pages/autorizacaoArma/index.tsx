import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box, Grid, Typography, Card, CardActions, CardContent, useMediaQuery, Backdrop, CircularProgress } from "@mui/material";
import DadosPessoais from "./sections/DadosPessoais";
import Endereco from "./sections/endereco/Endereco";
import DocumentosParaAssinar from "./sections/DocumentosParaAssinar/DocumentosParaAssinar";
import SideBar from "../../components/sideBar/SideBar";
import StepperMobile from '../../components/stepper/StepperMobile';
import { apiRequest } from "../../services/api/apiRequestService";
import { validarStepper } from "./sections/utils/ValidarStepper";
import { cancelarPoolingDocumentos } from "./sections/hooks/BuscarDocumentosPolling";
import { ProcessoAggregate } from './domain/ProcessoAggregate'
import CustomSnackbar from './sections/utils/CustomSnackbar';
import AddIcon from "@mui/icons-material/AddCircleOutline";
import { useProcesso } from "./sections/context/useProcesso";
import ComprovanteResidencia from "./sections/endereco/ComprovanteResidencia";

export default function AutorizacaoArma() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [sectionVisibility, setSectionVisibility] = React.useState({
    dadosPessoais: true,
    endereco: true,
    documentosParaAssinar: true,
  });
  const [buttonText, setButtonText] = useState("Clique para copiar sua url");
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [carregandoDadosIniciais, setCarregandoDadosIniciais] = useState(true);
  const documentosSessaoRef = useRef<HTMLDivElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { processoAggregate, setProcessoAggregate, resetProcessoAggregate } = useProcesso();

  const atualizaUuidUrlELocalStorage = useCallback(
    (id: string) => {
      localStorage.setItem("user-uuid", id);
      const urlParams = new URLSearchParams(location.search);
      if (!urlParams.has("id") || urlParams.get("id") !== id) {
        urlParams.set("id", id);
        navigate(`?${urlParams.toString()}`, { replace: true });
      }
    },
    [navigate, location]
  );

  const buscarDados = useCallback(async (id: string) => {
    const response = await apiRequest({
      method: 'GET',
      endpoint: `/${id}`,
    });

    if (response.status === 200) {
      try {
        const data: ProcessoAggregate = response.data;

        setProcessoAggregate(data);

        const step = validarStepper(data);
        setActiveStep(step);

      } catch (error) {
        console.error("Erro ao fazer o parse do JSON:", error);
        setSnackbarOpen(true);
      }
    } else if (response.status !== 404) {
      console.error("Erro ao buscar dados:", response.data || "Erro desconhecido");
    }

    setCarregandoDadosIniciais(false);
  }, [setProcessoAggregate]);

  useEffect(() => {

    const buscarDadosEAtualizarEstado = async () => {
      const urlParams = new URLSearchParams(location.search);
      const urlId = urlParams.get("id");
      const storedId = localStorage.getItem("user-id");

      if (urlId && urlId !== storedId) {
        await buscarDados(urlId);
        atualizaUuidUrlELocalStorage(urlId);
      } else if (storedId) {
        await buscarDados(storedId);
        atualizaUuidUrlELocalStorage(storedId);
      } else {

        try {
          const createResponse = await apiRequest({
            method: 'POST',
            endpoint: '/',
            data: {},
          });

          if (createResponse.status === 200) {
            const newId = createResponse.data.id;
            await buscarDados(newId);
            atualizaUuidUrlELocalStorage(newId);
          } else {
            console.error("Erro ao criar novo processo:", createResponse.data || "Erro desconhecido");
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error("Erro ao criar novo processo:", error);
          setSnackbarOpen(true);
        }
      }
    };

    buscarDadosEAtualizarEstado();
  }, [location.search, buscarDados, atualizaUuidUrlELocalStorage]);

  const handleNovoProcesso = async () => {
    console.log("Botão de novo cadastro clicado");

    resetProcessoAggregate();

    const leadData = localStorage.getItem('leadData');
    const parsedLead = leadData ? JSON.parse(leadData) : {};

    await apiRequest({
      method: 'POST',
      endpoint: `/${processoAggregate.id}/lead`,
      data: parsedLead
    });

    cancelarPoolingDocumentos();

    const createResponse = await apiRequest({
      method: 'POST',
      endpoint: '/',
      data: {},
    });

    localStorage.setItem("user-id", createResponse.data.id);

    urlParams.set("id", createResponse.data.id);

    navigate(`?${urlParams.toString()}`, { replace: true });

    setSectionVisibility((prev) => ({
      ...prev,
      dadosPessoais: true,
      endereco: true,
    }));

    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const fecharSessaoPreenchida = async (section: string) => {
    const step = validarStepper(processoAggregate);
    setActiveStep(step);

    setSectionVisibility((prev) => ({
      ...prev,
      [section]: false,
    }));
  };

  const alternarVisibilidadeSessao = (section: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
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
  const buttonRef = useRef(null);
  const steps = ['Dados pessoais', 'Endereço', 'Documentos concluídos'];

  const stepsWithContent = [
    {
      label: 'Dados pessoais',
      description: 'Preencha seus dados básicos para que possamos gerar os primeiros documentos para você. Nessa etapa iremos gerar 2 documentos',
    },
    {
      label: 'Endereço',
      description: 'Excelente! Agora, informe os dados de endereço. Utilizaremos ferramentas oficiais do governo para automatizar esse processo e gerar mais três documentos',
    },
    {
      label: 'Documentos prontos',
      description: 'Aguarde alguns segundos para a finalização dos seus documentos e faça o download abaixo 👇',
      content: <DocumentosParaAssinar fullView={false} setActiveStep={setActiveStep}
      />
    }
  ];

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={carregandoDadosIniciais}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid
        container
        sx={{
          minHeight: "100vh",
          paddingTop: { xs: "0px", sm: "0px", md: "145px" },
        }}
      >

        <SideBar
          activeStep={activeStep}
          steps={stepsWithContent}
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
              maxWidth: { sm: "100%", md: 720 },
            }}
          >

            {isExtraSmallScreen && (

              <StepperMobile activeStep={activeStep} steps={steps} />

            )}

            <DadosPessoais
              visibilidadeSessao={sectionVisibility.dadosPessoais}
              alternarVisibilidadeSessao={() => alternarVisibilidadeSessao("dadosPessoais")}
              fecharSessaoPreenchida={() => fecharSessaoPreenchida("dadosPessoais")}
              setActiveStep={setActiveStep}
              inputRef={nameInputRef}
              carregandoDadosIniciais={carregandoDadosIniciais}
            />

            <Endereco
              visibilidadeSessao={sectionVisibility.endereco}
              alternarVisibilidadeSessao={() => alternarVisibilidadeSessao("endereco")}
              fecharSessaoPreenchida={() => fecharSessaoPreenchida("endereco")}
              setActiveStep={setActiveStep}
              carregandoDadosIniciais={carregandoDadosIniciais}
            />

            <ComprovanteResidencia />

            <Grid ref={documentosSessaoRef} item xs={12} sx={{ padding: '10px', paddingBottom: 0 }}>

              <Typography variant="h5" component="h2" color={"#211f50"} align='center'>
                Seus documentos
              </Typography>

              <DocumentosParaAssinar
                setActiveStep={setActiveStep}
              />

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
              onClick={() => {
                handleNovoProcesso();
              }}
              startIcon={<AddIcon />}
              variant="contained"
              sx={{
                margin: "0 15px 15px 25px",
                padding: "10px 20px",
                minWidth: "250px",
              }}
            >
              Iniciar um novo processo
            </Button>
          </Box>

          <Box
            sx={{
              width: "275px",
              position: "fixed",
              top: "170px",
              right: "2%",
              zIndex: 2000,
              paddingTop: { xs: "90px", sm: "55px", md: "0%", lg: "0%" },
              display: isExtraSmallScreen ? "none" : "block"
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
              <Card sx={{ minWidth: 275 }}>
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
          <CustomSnackbar
            snackbarOpen={snackbarOpen}
            setSnackbarOpen={setSnackbarOpen}
            message="Ocorreu um erro ao buscar dados desse processo"
            severity="error"
          />
        </Grid>
      </Grid >
    </>
  );
}