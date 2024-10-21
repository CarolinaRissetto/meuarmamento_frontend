import React, { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import MaskInput from './MaskInput';

interface RGInputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const validarRG = (rg: string): boolean => {
  const rgClean = rg.replace(/[^\d]+/g, '');
  if (rgClean.length === 0)
    return true;
  return rgClean.length === 10;
};

const RGInput: React.FC<RGInputProps> = ({ name, value, onChange, onBlur }) => {
  const [error, setError] = useState<boolean>(false);

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur(event);
    const isValid = validarRG(event.target.value);
    setError(!isValid);
  };

  return (
    <FormControl error={error} variant="outlined" fullWidth>
      <FormLabel htmlFor={name} required>
        RG
      </FormLabel>
      <OutlinedInput
        id={name}
        name={name}
        type="text"
        placeholder="00000000-00"
        autoComplete={name}
        required
        onChange={onChange}
        onBlur={handleBlur}
        inputComponent={MaskInput as any}
        inputProps={{
          mask: "00000000-00",
          name: name,
          unmask: true,
          value: value || "",
        }}
      />
      {error && (
        <FormHelperText>RG inválido</FormHelperText>
      )}
    </FormControl>
  );
};

export default RGInput;
