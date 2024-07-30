import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/system";
import SectionHeader from "./Cabecalho";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from '@mui/material/Box';

const FormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));


interface EnderecoProps {
    isVisible: boolean;
    onToggle: () => void;
    onFilled: () => void;
}

const handleFileChange = (
    year: number,
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<{ [key: number]: File | null }>>
) => {
    if (event.target.files && event.target.files.length > 0) {
        setFiles((prevFiles) => ({
            ...prevFiles,
            [year]: event.target.files![0],
        }));
    }
};

const Endereco: React.FC<EnderecoProps> = ({ isVisible, onToggle, onFilled }) => {
    const [filled, setFilled] = useState(false);
    const [open, setOpen] = useState(isVisible);
    const [sameAddress, setSameAddress] = useState('yes');

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSameAddress((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        if (!filled && isFormFilled()) {
            setFilled(true);
            onFilled();
            setOpen(false); // Colapsar a seção quando preenchida pela primeira vez
        }
    }, [filled, onFilled]);

    const isFormFilled = () => {
        // Verifique se todos os campos obrigatórios estão preenchidos
        const inputs = document.querySelectorAll("#endereco-form input[required]");
        for (let i = 0; i < inputs.length; i++) {
            if (!(inputs[i] as HTMLInputElement).value) {
                return false;
            }
        }
        return true;
    };

    const handleToggle = () => {
        setOpen(!open);
        onToggle();
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [files, setFiles] = useState<{ [key: number]: File | null }>({});

    return (
        <div>
            <Box sx={{ my: 2 }}>
                <Grid container alignItems="center"
                    sx={{
                        borderColor: 'primary.light',
                        '&:hover': { background: '#E3DFDC' },
                        borderRadius: "5px"
                    }}
                >
                    <Grid item xs={11}>
                        <SectionHeader title="Endereço" />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton onClick={handleToggle}>
                            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Collapse in={open}>
                <Grid container spacing={3} marginTop={"5px"} marginBottom={"70px"} id="endereco-form">
                    <FormGrid item xs={12}>
                        <FormLabel component="legend">
                            Morou no mesmo endereço nos últimos 5 anos?
                        </FormLabel>
                        <RadioGroup
                            row
                            aria-label="same-address"
                            name="same-address"
                            defaultValue="yes"
                            value={sameAddress}
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
                            <FormControlLabel value="no" control={<Radio />} label="Não" />
                        </RadioGroup>
                    </FormGrid>
                    {sameAddress === 'no' && (
                        <FormGrid item xs={12} md={6}>
                            <FormLabel htmlFor="num-addresses" required>
                                Quantos endereços diferentes morou nos últimos 5 anos?
                            </FormLabel>
                            <OutlinedInput
                                id="num-addresses"
                                name="num-addresses"
                                type="number"
                                autoComplete="num-addresses"
                                required
                            />
                        </FormGrid>
                    )}
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="cep" required style={{ marginTop: "22px" }}>
                            CEP
                        </FormLabel>
                        <OutlinedInput
                            id="cep"
                            name="cep"
                            type="text"
                            autoComplete="cep"
                            required
                        />
                    </FormGrid>
                    <FormGrid item xs={12}>
                        <FormLabel htmlFor="address" required>
                            Endereço
                        </FormLabel>
                        <OutlinedInput
                            id="address"
                            name="address"
                            type="text"
                            autoComplete="address"
                            required
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={2}>
                        <FormLabel htmlFor="number" required>
                            Nº
                        </FormLabel>
                        <OutlinedInput
                            id="number"
                            name="number"
                            type="text"
                            autoComplete="number"
                            required
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={4}>
                        <FormLabel htmlFor="complement" required>
                            Complemento
                        </FormLabel>
                        <OutlinedInput
                            id="complement"
                            name="complement"
                            type="text"
                            autoComplete="complement"
                            required
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="city" required>
                            Cidade
                        </FormLabel>
                        <OutlinedInput
                            id="city"
                            name="city"
                            type="text"
                            autoComplete="city"
                            required
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="neighborhood" required>
                            Bairro
                        </FormLabel>
                        <OutlinedInput
                            id="neighborhood"
                            name="neighborhood"
                            type="text"
                            autoComplete="neighborhood"
                            required
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="state" required>
                            UF
                        </FormLabel>
                        <OutlinedInput
                            id="state"
                            name="state"
                            type="text"
                            autoComplete="state"
                            required
                        />
                    </FormGrid>
                    {years.map((year) => (
                        <Grid item xs={12} md={6} key={year}>
                            <FormLabel htmlFor={`comprovante-${year}`} required>
                                {files[year] ? files[year]!.name : `Comprovante de Residência de ${year}`}
                            </FormLabel>
                            <Button
                                variant="contained"
                                component="label"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'normal',
                                    lineHeight: '1.2em',
                                    maxHeight: '3.2em',
                                }}
                            >
                                Comprovante de Residência de {year}
                                <input
                                    type="file"
                                    id={`comprovante-${year}`}
                                    name={`comprovante-${year}`}
                                    onChange={(e) => handleFileChange(year, e, setFiles)}
                                    hidden
                                />
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </div>
    );
};

export default Endereco;
