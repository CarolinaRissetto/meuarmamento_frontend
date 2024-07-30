import * as React from "react";
import { useState, useEffect, useRef } from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import Collapse from "@mui/material/Collapse";
import SectionHeader from "./Cabecalho";
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { uuid } from "short-uuid";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

interface DadosPessoaisProps {
  isVisible: boolean;
  onToggle: () => void;
  onFilled: () => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formData: { [key: string]: string };
  uuid: string | null;
}

const DadosPessoais: React.FC<DadosPessoaisProps> = ({ isVisible, onToggle, onFilled, handleInputChange, formData, uuid }) => {
  const [filled, setFilled] = useState(false);
  const [open, setOpen] = useState(isVisible);
  const [inputTouched, setInputTouched] = useState(false);
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

  const saveFormData = async (data: any) => {
    try {
      const response = await fetch('http://localhost:3001/dados-pessoais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar dados.');
      }

      console.log('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }finally {
      setDirty(false); // Reset dirty state after saving
    }
  };

  useEffect(() => {
    if (isFormFilled() && !filled) {
      setFilled(true);
      onFilled();
    }
  }, [filled, onFilled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (filled && dirty) {
          setOpen(false); // Colapsar a seção quando clicado fora, se preenchido
          saveFormData({
            uuid: uuid,
            nomeCompleto: formData["first-name"] || "",
            cpf: formData["cpf"] || "",
            rg: formData["rg"] || "",
            nacionalidade: formData["nationality"] || "",
            dataNascimento: formData["birthdate"] || "",
            nomeMae: formData["mother-name"] || "",
            nomePai: formData["father-name"] || ""
          });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filled, dirty, formData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(event);
    setDirty(true); // Set dirty state on change
  };  

  const handleToggle = () => {
    setOpen(!open);
    onToggle();
  };

  const handleInputBlur = () => {
    setInputTouched(true);
  };

  return (
    <Box>
      <Grid
        container
        alignItems="center"
        sx={{
          borderColor: 'primary.light',
          '&:hover': { background: '#E3DFDC' },
          borderRadius: "5px",
          cursor: 'pointer'
        }}
        onClick={handleToggle}
      >
        <Grid item xs={11}>
          <SectionHeader title="Dados Pessoais" />
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
            <FormLabel htmlFor="first-name" required>
              Nome completo
            </FormLabel>
            <OutlinedInput
              id="first-name"
              name="first-name"
              type="text"
              autoComplete="first-name"
              required
              value={formData["first-name"] || ""}
              onChange={handleChange}
              onBlur={handleInputBlur}
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
            <FormLabel htmlFor="nationality" required>
              Nacionalidade
            </FormLabel>
            <OutlinedInput
              id="nationality"
              name="nationality"
              type="text"
              placeholder="Brasileiro(a)"
              autoComplete="nationality"
              required
              value={formData["nationality"] || ""}
              onChange={handleChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12} md={6}>
            <FormLabel htmlFor="birthdate" required>
              Data de Nascimento
            </FormLabel>
            <OutlinedInput
              id="birthdate"
              name="birthdate"
              type="date"
              placeholder="DD/MM/AAAA"
              autoComplete="birthdate"
              required
              value={formData["birthdate"] || ""}
              onChange={handleChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormLabel htmlFor="mother-name" required>
              Nome Completo da Mãe
            </FormLabel>
            <OutlinedInput
              id="mother-name"
              name="mother-name"
              type="text"
              placeholder="Nome Completo da Mãe"
              autoComplete="mother-name"
              required
              value={formData["mother-name"] || ""}
              onChange={handleChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
          <FormGrid item xs={12}>
            <FormLabel htmlFor="father-name" required>
              Nome Completo do Pai
            </FormLabel>
            <OutlinedInput
              id="father-name"
              name="father-name"
              type="text"
              placeholder="Nome Completo do Pai"
              autoComplete="father-name"
              required
              value={formData["father-name"] || ""}
              onChange={handleChange}
              onBlur={handleInputBlur}
            />
          </FormGrid>
        </Grid>
      </Collapse>
    </Box>
  );
};

export default DadosPessoais;
