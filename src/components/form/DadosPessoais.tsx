import * as React from "react";
import { useState, useEffect } from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import Collapse from "@mui/material/Collapse";
import SectionHeader from "./Cabecalho";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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

const DadosPessoais: React.FC<DadosPessoaisProps> = ({ isVisible, onFilled, handleInputChange, formData }) => {
  const [filled, setFilled] = useState(false);
  const [open, setOpen] = useState(isVisible);

  useEffect(() => {
    if (!filled && isFormFilled()) {
      setFilled(true);
      onFilled();
      setOpen(false); // Colapsar a seção quando preenchida pela primeira vez
    }
  }, [filled]);

  const isFormFilled = () => {
    const inputs = document.querySelectorAll("#dados-pessoais-form input[required]");
    for (let i = 0; i < inputs.length; i++) {
      if (!(inputs[i] as HTMLInputElement).value) {
        return false;
      }
    }
    return true;
  };

  const handleToggle = () => {
    setOpen(!open);
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
        }}
      >
        <Grid item xs={11}>
          <SectionHeader title="Dados Pessoais" />
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={handleToggle}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={open}>
        <Grid container spacing={3} marginTop={"5px"} id="dados-pessoais-form">
          <FormGrid item xs={12}>
            <FormLabel htmlFor="first-name" required>
              Nome completo
            </FormLabel>
            <OutlinedInput
              id="first-name"
              name="first-name"
              type="name"
              autoComplete="first name"
              required
              value={formData["first-name"] || ""}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              autoComplete="bdate"
              required
              value={formData["birthdate"] || ""}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </FormGrid>
        </Grid>
      </Collapse>
    </div>
  );
};

export default DadosPessoais;
