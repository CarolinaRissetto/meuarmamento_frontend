import React, { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import MaskInput from './MaskInput';

interface CEPInputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  endAdornment?: React.ReactNode;
}

const validarCEP = (cep: string): boolean => {
  if (cep === "")
    return true;

  const regex = /^\d{5}-\d{3}$/;
  return regex.test(cep);
};

const CEPInput: React.FC<CEPInputProps> = ({ name, value, onChange, onBlur, endAdornment, ...rest }) => {
  const [error, setError] = useState<boolean>(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur(event);
    const isValid = validarCEP(event.target.value);
    setError(!isValid);
  };

  return (
    <FormControl error={error} variant="outlined" fullWidth>
      <FormLabel htmlFor={name} required>
        CEP
      </FormLabel>
      <OutlinedInput
        id={name}
        name={name}
        type="text"
        placeholder="00000-000"
        autoComplete={name}
        required
        onChange={onChange}
        onBlur={handleBlur}
        inputComponent={MaskInput as any}
        inputProps={{
          mask: "00000-000",
          name: name,
          unmask: false,
          value: value || "",
        }}
        endAdornment={endAdornment}
        {...rest} />
      {error && (
        <FormHelperText>CEP inválido</FormHelperText>
      )}
    </FormControl>
  );
};

export default CEPInput;
