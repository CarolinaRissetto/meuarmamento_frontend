import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  Collapse,
  FormLabel,
  Grid,
  IconButton,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CustomSnackbar from './utils/CustomSnackbar';
import { apiRequest } from "../../../services/api/apiRequestService";
import { ProcessoAggregate, isDadosPessoaisFilled } from '../domain/ProcessoAggregate'
import { gerarPdfsTemplates } from "../../../services/pdf/gerarPDFsTemplates";
import { gerarCertidoes } from "./utils/GerarCertidoes";

interface DadosPessoaisProps {
  visibilidadeSessao: boolean;
  alternarVisibilidadeSessao: () => void;
  fecharSessaoPreenchida: () => void;
  processoAggregate: ProcessoAggregate;
  setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>;
  setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>;
  uuid: string | null;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  inputRef?: RefObject<HTMLInputElement>;
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({
  visibilidadeSessao,
  alternarVisibilidadeSessao,
  fecharSessaoPreenchida,
  processoAggregate,
  uuid,
  setPdfUrls,
  setProcessoAggregate,
  inputRef
}) => {
  const [isSessaoAberta, setIsSessaoAberta] = useState(visibilidadeSessao);
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setIsSessaoAberta(visibilidadeSessao);
  }, [visibilidadeSessao]);

  useEffect(() => {
    const handleFocusChange = (event: FocusEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (isDadosPessoaisFilled(processoAggregate) && isDirty && isSessaoAberta) {
          fecharSessaoPreenchida();
          setSnackbarOpen(true);
          gerarPdfsTemplates(uuid, setPdfUrls, processoAggregate, setProcessoAggregate);
          gerarCertidoes(uuid, setPdfUrls, processoAggregate, setProcessoAggregate);
          setIsDirty(false);
        }
      }
    };

    document.addEventListener("focusin", handleFocusChange);

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
    };
  }, [isDirty, isSessaoAberta, processoAggregate, uuid, fecharSessaoPreenchida, setPdfUrls, setProcessoAggregate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const previousValue = processoAggregate[name as keyof ProcessoAggregate];

    if (previousValue !== value) {
      setIsDirty(true);
    }

    setProcessoAggregate({
      ...processoAggregate,
      [name]: value
    });
  };

  const handleInputBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setProcessoAggregate({
      ...processoAggregate,
      [name]: value
    });

    if (uuid) {
      await apiRequest({
        tipo: "dadosPessoais",
        data: {
          uuid,
          ...processoAggregate,
        },
      });
    }
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
        onClick={alternarVisibilidadeSessao}
      >
        <Grid item xs={11}>
          <Typography variant="h5" component="h2" color={"#1465C0"} align='center'>
            Dados Pessoais
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton>
            {isSessaoAberta ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={isSessaoAberta}>
        <Grid container spacing={3} marginTop={"5px"} id="dados-pessoais-form" ref={formRef}>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
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
              value={processoAggregate.nomeCompleto || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              inputRef={inputRef}
              sx={{
                backgroundColor: 'white',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2 !important',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
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
              value={processoAggregate.cpf || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
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
              value={processoAggregate.rg || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
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
              value={processoAggregate.nacionalidade || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
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
              value={processoAggregate.dataNascimento || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
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
              value={processoAggregate.nomeMae || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor="nomePai" required>
              Nome Completo do Pai
            </FormLabel>
            <OutlinedInput
              id="nomePai"
              name="nomePai"
              type="text"
              placeholder="Nome Completo do Pai"
              autoComplete="nomePai"
              required
              value={processoAggregate.nomePai || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
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
