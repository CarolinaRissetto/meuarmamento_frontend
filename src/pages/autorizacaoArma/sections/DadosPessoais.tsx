import * as React from "react";
import { useState, useEffect, useRef, RefObject } from "react";
import {
  Collapse,
  FormLabel,
  Grid,
  IconButton,
  OutlinedInput,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { gerarPdfsTemplates } from "../../../services/pdf/gerarPDFsTemplates";
import { gerarCertidoes } from "./utils/GerarCertidoes";
import CustomSnackbar from './utils/CustomSnackbar';
import { apiRequest } from "../../../services/api/apiRequestService";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface DadosPessoaisProps {
  visibilidadeSessao: boolean;
  alternarVisibilidadeSessao: () => void;
  fecharSessaoPreenchida: () => void;
  formData: { [key: string]: string };
  setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>;
  uuid: string | null;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  inputRef?: RefObject<HTMLInputElement>;
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({ visibilidadeSessao, alternarVisibilidadeSessao, fecharSessaoPreenchida, formData, uuid, setPdfUrls, setFormData, inputRef }) => {
  const [sessaoAberta, setSessaoAberta] = useState(visibilidadeSessao);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isFormFilled = () => {
    const inputs = document.querySelectorAll("#dados-pessoais-form input[required]");
    for (let i = 0; i < inputs.length; i++) {
      if (!(inputs[i] as HTMLInputElement).value) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setSessaoAberta(visibilidadeSessao);
  }, [visibilidadeSessao]);

  useEffect(() => {

    const handleFocusChange = (event: FocusEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (isFormFilled() && dirty) {
          if (sessaoAberta) {
            fecharSessaoPreenchida();
            setSnackbarOpen(true);
            gerarPdfsTemplates(formData, uuid, setPdfUrls, setFormData);
            gerarCertidoes(formData, setPdfUrls, uuid, setFormData);
            setDirty(false)
          }
        }
      }
    };

    document.addEventListener("focusin", handleFocusChange);

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, formData, uuid]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const valorAnterior = formData[name as keyof typeof formData];

    if (valorAnterior !== value) {
      setDirty(true);
    }

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  };

  const handleInputBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (uuid) {
      await apiRequest({
        tipo: "dadosPessoais",
        data: {
          uuid,
          ...updatedFormData,
        },
      });
    }
  };

  const handleToggle = () => {
    alternarVisibilidadeSessao();
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        sx={{
          borderColor: 'primary.light',
          '&:hover': { background: '#E3DFDC' },
          borderRadius: "5px",
          cursor: 'pointer',
          padding: '10px',
        }}
        onClick={handleToggle}
      >
        <Grid item xs={11}>
          <Typography variant="h5" component="h2" color={"#1465C0"} align='center'>
            Dados Pessoais
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton>
            {sessaoAberta ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={sessaoAberta}>
        <Grid container spacing={3} marginTop={"5px"} id="dados-pessoais-form" ref={formRef}>
          <FormGrid item xs={12}>
            <FormLabel htmlFor="nomeCompleto" required>
              Nome completo
            </FormLabel>
            <OutlinedInput
              id="nomeCompleto"
              name="nomeCompleto"
              placeholder="Seu nome completo"
              type="text"
              autoComplete="nomeCompleto"
              required
              value={formData["nomeCompleto"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              inputRef={inputRef}
              sx={{
                backgroundColor: 'white',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2 !important', // Cor ao focar
                },
              }}
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="cpf" required>
              CPF
            </FormLabel>
            <OutlinedInput
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              autoComplete="cpf"
              required
              value={formData["cpf"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="rg" required>
              RG
            </FormLabel>
            <OutlinedInput
              id="rg"
              name="rg"
              type="text"
              placeholder="00.000.000-0"
              autoComplete="rg"
              required
              value={formData["rg"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="nacionalidade" required>
              Nacionalidade
            </FormLabel>
            <OutlinedInput
              id="nacionalidade"
              name="nacionalidade"
              type="text"
              placeholder="Brasileiro(a)"
              autoComplete="nacionalidade"
              required
              value={formData["nacionalidade"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="dataNascimento" required>
              Data de Nascimento
            </FormLabel>
            <OutlinedInput
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              placeholder="DD/MM/AAAA"
              autoComplete="dataNascimento"
              required
              value={formData["dataNascimento"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormLabel htmlFor="nomeMae" required>
              Nome Completo da Mãe
            </FormLabel>
            <OutlinedInput
              id="nomeMae"
              name="nomeMae"
              type="text"
              placeholder="Nome Completo da Mãe"
              autoComplete="nomeMae"
              required
              value={formData["nomeMae"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormLabel htmlFor="father-name" required>
              Nome Completo do Pai
            </FormLabel>
            <OutlinedInput
              id="nomePai"
              name="nomePai"
              type="text"
              placeholder="Nome Completo do Pai"
              autoComplete="nomePai"
              required
              value={formData["nomePai"] || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
        </Grid>
      </Collapse>
      <CustomSnackbar
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        message="Iniciando a geração de 2 documentos..."
        severity="success"
      />
    </div>
  );
};

export default DadosPessoais;
