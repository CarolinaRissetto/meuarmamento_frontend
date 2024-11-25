import React, { useState } from 'react';
import { FormControl, FormHelperText, FormLabel, OutlinedInput } from "@mui/material";
import MaskInput from './MaskInput';

interface DataNascimentoInputProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const validarDataNascimento = (data: string): boolean => {
    const dataClean = data.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (dataClean.length !== 8) return false;

    const dia = parseInt(dataClean.substring(0, 2), 10);
    const mes = parseInt(dataClean.substring(2, 4), 10);
    const ano = parseInt(dataClean.substring(4, 8), 10);

    const dataObj = new Date(`${ano}-${mes}-${dia}`);
    return (
        dataObj.getFullYear() === ano &&
        dataObj.getMonth() + 1 === mes &&
        dataObj.getDate() === dia
    );
};

const DataNascimentoInput: React.FC<DataNascimentoInputProps> = ({ name, value, onChange, onBlur }) => {
    const [error, setError] = useState<boolean>(false);
    const [helperText, setHelperText] = useState<string>('');

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur(event);
        const isValid = validarDataNascimento(event.target.value);
        if (!isValid) {
            setError(true);
            setHelperText('Data inválida');
        } else {
            setError(false);
            setHelperText('');
        }
    };

    return (
        <FormControl error={error} variant="outlined" fullWidth>
            <FormLabel htmlFor={name} required>
                Data de Nascimento
            </FormLabel>
            <OutlinedInput
                id={name}
                name={name}
                type="text"
                placeholder="DD/MM/AAAA"
                autoComplete={name}
                required
                value={value || ""}
                onChange={onChange}
                onBlur={handleBlur}
                inputComponent={MaskInput as any}
                inputProps={{
                    mask: "00/00/0000",
                    name: name,
                    unmask: false,
                }}
                sx={{
                    backgroundColor: 'white',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976D2 !important',
                    },
                }}
            />
            {error && (
                <FormHelperText>{helperText}</FormHelperText>
            )}
        </FormControl>
    );
};

export default DataNascimentoInput;
