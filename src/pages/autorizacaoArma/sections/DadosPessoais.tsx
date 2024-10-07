import * as React from "react";
import { useState, useEffect, useRef } from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { gerarPdfsTemplates } from "../../../services/pdf/gerarPDFsTemplates";
import { Typography } from '@mui/material';
import { gerarCertidoes } from "./utils/GerarCertidoes";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface DadosPessoaisProps {
  isVisible: boolean;
  onToggle: () => void;
  onFilled: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  formData: { [key: string]: string };
  setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>;
  uuid: string | null;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({ isVisible, onToggle, onFilled, handleInputChange, formData, uuid, handleInputBlur, setPdfUrls, setFormData }) => {
  const [filled, setFilled] = useState(false);
  const [open, setOpen] = useState(isVisible);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

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
    if (isFormFilled() && !filled) {
      setFilled(true);
      onFilled();
    }
  }, [filled, onFilled, formData]);

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (filled && dirty) {
          if (open) {
            setOpen(false);
            gerarPdfsTemplates(formData, uuid, setPdfUrls);
            gerarCertidoes(formData, setPdfUrls, uuid, setFormData);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filled, dirty, formData, uuid]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    setDirty(true);
  };

  const handleToggle = () => {
    setOpen(!open);
    onToggle();
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
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={open}>
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
              onChange={handleChange}
              onBlur={handleInputBlur}
              sx={{ backgroundColor: 'white' }} // Fundo branco

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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
        </Grid>
      </Collapse>
    </div>
  );
};

export default DadosPessoais;
