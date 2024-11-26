import React, { useState, useEffect, useRef, RefObject } from "react";
import {
  Collapse,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CustomSnackbar from './utils/CustomSnackbar';
import { apiRequest } from "../../../services/api/apiRequestService";
import { ProcessoAggregate, isDadosPessoaisFilled } from '../domain/ProcessoAggregate';
import CPFInput from './utils/inputs/CPFInput';
import { SelectChangeEvent } from '@mui/material/Select';
import DataNascimentoInput from "./utils/inputs/DataNascimentoInput";
import { EstadoCivil } from "../domain/enums/EstadoCivil";
import { useProcesso } from "./context/useProcesso";
import { Sexo } from "../domain/enums/Sexo";
import { buscarDocumentosPolling } from "./hooks/BuscarDocumentosPolling";
import useAutoSave from "./hooks/useAutoSave";

interface DadosPessoaisProps {
  visibilidadeSessao: boolean;
  alternarVisibilidadeSessao: () => void;
  fecharSessaoPreenchida: () => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  inputRef?: RefObject<HTMLInputElement>;
  carregandoDadosIniciais: boolean;
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({
  visibilidadeSessao,
  alternarVisibilidadeSessao,
  fecharSessaoPreenchida,
  inputRef,
  carregandoDadosIniciais
}) => {
  const { processoAggregate, setProcessoAggregate } = useProcesso();
  const [isSessaoAberta, setIsSessaoAberta] = useState(visibilidadeSessao);
  const [isDirty, setIsDirty] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const hasMounted = useRef(false);

  useAutoSave({
    isFilled: isDadosPessoaisFilled(processoAggregate.dadosPessoais),
    isDirty,
    isOpen: isSessaoAberta,
    hasMounted,
    processoId: processoAggregate.id,
    fecharSessaoPreenchida,
    setSnackbarOpen,
    buscarDocumentos: () => buscarDocumentosPolling(setProcessoAggregate, processoAggregate.id),
    setIsDirty
  });

  useEffect(() => {
    setIsSessaoAberta(visibilidadeSessao);
  }, [visibilidadeSessao]);

  useEffect(() => {
    if (!carregandoDadosIniciais) {
      hasMounted.current = true;
    }
  }, [carregandoDadosIniciais]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;

    if (typeof name !== 'string') {
      console.error("O atributo 'name' está ausente ou não é uma string.");
      return;
    }

    const previousValue = processoAggregate.dadosPessoais[name as keyof ProcessoAggregate['dadosPessoais']];

    if (previousValue !== value && hasMounted.current) {
      setIsDirty(true);
    }

    setProcessoAggregate(prev => ({
      ...prev,
      dadosPessoais: {
        ...prev.dadosPessoais,
        [name]: value,
      },
      dataAlteracao: new Date().toISOString(),
    }));
  };

  const handleInputBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (processoAggregate.id) {
      await apiRequest({
        method: 'PATCH',
        endpoint: `/${processoAggregate.id}`,
        path: `/dadosPessoais/${name}`,
        data: value
      });
    }

    setProcessoAggregate(prev => ({
      ...prev,
      dadosPessoais: {
        ...prev.dadosPessoais,
        [name]: value,
      },
      dataAlteracao: new Date().toISOString(),
    }));
  };

  return (
    <div>
      <Grid
        container
        alignItems="center"
        sx={{
          borderColor: 'primary.light',
          background: 'primary.light',
          '&:hover': {
            background: '#E3DFDC',
          },
          borderRadius: "5px",
          cursor: 'pointer',
          padding: '10px',
        }}
        onClick={alternarVisibilidadeSessao}
      >
        <Grid item xs={11}>
          <Typography variant="h5" component="h2" color={"#211f50"} align='center'>
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
        <Grid container spacing={3} marginTop={"5px"} id="dados-pessoais-form">
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
              value={processoAggregate.dadosPessoais.nomeCompleto || ""}
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
            <CPFInput
              name="cpf"
              value={processoAggregate.dadosPessoais.cpf || ""}
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
              placeholder="Digite seu RG"
              autoComplete="rg"
              required
              value={processoAggregate.dadosPessoais.rg || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              sx={{
                backgroundColor: 'white',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976D2 !important',
                },
              }}
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
              value={processoAggregate.dadosPessoais.nacionalidade || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <DataNascimentoInput
              name="dataNascimento"
              value={processoAggregate.dadosPessoais.dataNascimento || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor="sexo" required>
              Sexo
            </FormLabel>
            <FormControl fullWidth required>
              <Select
                displayEmpty
                labelId="sexo-label"
                id="sexo"
                name="sexo"
                placeholder="Selecione"
                value={processoAggregate.dadosPessoais.sexo || ""}
                label="Sexo"
                required
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                sx={{
                  backgroundColor: 'white',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976D2 !important',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: '#aaa' }}>Selecione</em>
                </MenuItem>
                {Object.entries(Sexo).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormLabel htmlFor="estadoCivil" required>
              Estado Civil
            </FormLabel>
            <FormControl fullWidth required>
              <Select
                displayEmpty
                labelId="estadoCivil-label"
                id="estadoCivil"
                name="estadoCivil"
                required
                value={processoAggregate.dadosPessoais.estadoCivil || ""}
                label="Estado Civil"
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                sx={{
                  backgroundColor: 'white',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976D2 !important',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: '#aaa' }}>Selecione</em>
                </MenuItem>
                {Object.entries(EstadoCivil).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              value={processoAggregate.dadosPessoais.nomeMae || ""}
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
              value={processoAggregate.dadosPessoais.nomePai || ""}
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