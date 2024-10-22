import React, { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import MaskInput from './MaskInput';

interface CPFInputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length === 0)
    return true;

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const CPFInput: React.FC<CPFInputProps> = ({ name, value, onChange, onBlur }) => {
  const [error, setError] = useState<boolean>(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur(event);
    const isValid = validarCPF(event.target.value);
    setError(!isValid);
  };

  return (
    <FormControl error={error} variant="outlined" fullWidth>
      <FormLabel htmlFor={name} required>
        CPF
      </FormLabel>
      <OutlinedInput
        id={name}
        name={name}
        type="text"
        placeholder="000.000.000-00"
        autoComplete="cpf"
        required
        value={value || ""}
        onChange={onChange}
        onBlur={handleBlur}
        inputComponent={MaskInput as any}
        inputProps={{
          mask: "000.000.000-00",
          name: name,
          unmask: true,
        }}
      />
      {error && (
        <FormHelperText>CPF inválido</FormHelperText>
      )}
    </FormControl>
  );
};

export default CPFInput;
