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
import { gerarPdfsTemplates } from "../../../services/pdf/gerarPDFsTemplates";
import { gerarCertidoes } from "./utils/GerarCertidoes";
import MaskInput from './utils/inputs/MaskInput';
import CPFInput from './utils/inputs/CPFInput';
import RGInput from './utils/inputs/RGInput';
import { SelectChangeEvent } from '@mui/material/Select';


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
  documentosSessaoRef: RefObject<HTMLDivElement>;
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({
  visibilidadeSessao,
  alternarVisibilidadeSessao,
  fecharSessaoPreenchida,
  processoAggregate,
  uuid,
  setPdfUrls,
  setProcessoAggregate,
  inputRef,
  documentosSessaoRef
}) => {
  const [isSessaoAberta, setIsSessaoAberta] = useState(visibilidadeSessao);
  const [isDirty, setIsDirty] = useState(false);
  const dadosPessoaisRef = useRef<HTMLDivElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    setIsSessaoAberta(visibilidadeSessao);
  }, [visibilidadeSessao]);

  useEffect(() => {
    const handleFocusChange = (event: FocusEvent) => {


      if (
        dadosPessoaisRef.current &&
        !dadosPessoaisRef.current.contains(event.target as Node) &&
        documentosSessaoRef.current &&
        !documentosSessaoRef.current.contains(event.target as Node)
      ) {
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

    if (typeof name !== 'string') {
      console.error("O atributo 'name' está ausente ou não é uma string.");
      return;
    }

    const previousValue = processoAggregate[name as keyof ProcessoAggregate];

    if (previousValue !== value) {
      setIsDirty(true);
    }

    setProcessoAggregate({
      ...processoAggregate,
      [name]: value
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    if (typeof name !== 'string') {
      console.error("O atributo 'name' está ausente ou não é uma string.");
      return;
    }

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
        <Grid container spacing={3} marginTop={"5px"} id="dados-pessoais-form" ref={dadosPessoaisRef}>
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
            <CPFInput
              name="cpf"
              value={processoAggregate.cpf || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <RGInput
              name="rg"
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
              type="text"
              placeholder="DD/MM/AAAA"
              autoComplete="dataNascimento"
              required
              value={processoAggregate.dataNascimento || ""}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              inputComponent={MaskInput as any}
              inputProps={{
                mask: "00/00/0000",
                name: "dataNascimento",
                unmask: false,
              }}
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
                value={processoAggregate.sexo || ""}
                label="Sexo"
                required
                onChange={handleSelectChange}
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
                <MenuItem value="feminino">Feminino</MenuItem>
                <MenuItem value="masculino">Masculino</MenuItem>
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
                value={processoAggregate.estadoCivil || ""}
                label="Estado Civil"
                onChange={handleSelectChange}
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
                <MenuItem value="solteiro(a)">Solteiro(a)</MenuItem>
                <MenuItem value="casado(a)">Casado(a)</MenuItem>
                <MenuItem value="divorciado(a)">Divorciado(a)</MenuItem>
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