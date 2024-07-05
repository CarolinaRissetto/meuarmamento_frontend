import * as React from "react";

import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function AddressForm() {
  return (
    <Grid container spacing={3} marginTop={"5px"}>
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
        />
      </FormGrid>
    </Grid>
  );
}