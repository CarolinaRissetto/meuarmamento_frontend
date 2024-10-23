import React, { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import MaskInput from './MaskInput';

interface TelefoneInputProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const validarTelefone = (telefone: string): boolean => {
    const telefoneClean = telefone.replace(/[^\d]+/g, '');
    return telefoneClean.length === 10 || telefoneClean.length === 11;
};

const TelefoneInput: React.FC<TelefoneInputProps> = ({ name, value, onChange, onBlur }) => {
    const [error, setError] = useState<boolean>(false);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur(event);
        const isValid = validarTelefone(event.target.value);
        setError(!isValid);
    };

    return (
        <FormControl error={error} variant="outlined" fullWidth>
            <FormLabel htmlFor={name} required>
                Telefone
            </FormLabel>
            <OutlinedInput
                id={name}
                name={name}
                type="tel"
                placeholder="(00) 00000-0000"
                autoComplete={name}
                required
                onChange={onChange}
                onBlur={handleBlur}
                inputComponent={MaskInput as any}
                inputProps={{
                    mask: "(00) 00000-0000", 
                    name: name,
                    unmask: true,
                    value: value || "",
                }}
            />
            {error && (
                <FormHelperText>Telefone inválido</FormHelperText>
            )}
        </FormControl>
    );
};

export default TelefoneInput;
