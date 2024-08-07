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
import { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Box from '@mui/material/Box';
import { nanoid } from 'nanoid';

const FormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));

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

interface EnderecoProps {
    isVisible: boolean;
    onToggle: () => void;
    onFilled: () => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    formData: { [key: string]: string };
    uuid: string | null;
}

const Endereco: React.FC<EnderecoProps> = ({ isVisible, onToggle, onFilled, handleInputChange, formData, uuid }) => {
    const [filled, setFilled] = useState(false);
    const [open, setOpen] = useState(isVisible);
    const [sameAddress, setSameAddress] = useState('yes');
    const [dirty, setDirty] = useState(false); // Definição do estado dirty
    const formRef = useRef<HTMLDivElement>(null);
    const [, setInputTouched] = useState(false);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [files, setFiles] = useState<{ [key: number]: File | null }>({});

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSameAddress((event.target as HTMLInputElement).value);
    };

    const isFormFilled = () => {
        const inputs = document.querySelectorAll("#endereco-form input[required]");
        for (let i = 0; i < inputs.length; i++) {
            if (!(inputs[i] as HTMLInputElement).value) {
                return false;
            }
        }
        return true;
    };

    const saveFormData = async (data: any) => {
        try {
            console.log('Dados a serem enviados:', data); // Log dos dados
            const response = await fetch('http://localhost:3010/processos/endereco', {
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
        } finally {
            setDirty(false); // Reset dirty state after saving
        }
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
                    setOpen(false); // Colapsar a seção quando clicado fora, se preenchido

                    let uuidEndereco = localStorage.getItem('uuidEndereco');
                    if (!uuidEndereco) {
                        uuidEndereco = nanoid(6);
                        localStorage.setItem('uuidEndereco', uuidEndereco);
                    }

                    saveFormData({
                        tipo: "endereco",
                        data: {
                            uuidEndereco: uuidEndereco,
                            quantosEnderecosMorou: formData["num-addresses"] || "",
                            cep: formData["cep"] || "",
                            rua: formData["rua"] || "",
                            numero: formData["number"] || "",
                            complemento: formData["complement"] || "",
                            cidade: formData["cidade"] || "",
                            bairro: formData["bairro"] || "",
                            uf: formData["uf"] || "",
                            uuidCliente: uuid
                        }
                    });
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filled, dirty, formData, uuid]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        setDirty(true); // Set dirty state on change
    };

    const handleToggle = () => {
        setOpen(!open);
        onToggle();
    };

    const handleInputBlur = () => {
        if (isFormFilled()) {
            setFilled(true);
            setOpen(false);
            onFilled();
        }
        setInputTouched(true);
    };

    // interface Endereco {
    //     uuidEndereco: string;
    //     quantosEnderecosMorou: string;
    //     cep: string;
    //     rua: string;
    //     numero: string;
    //     complemento: string;
    //     cidade: string;
    //     bairro: string;
    //     uf: string;
    //   }
      
    //   interface FormData {
    //     endereco: Endereco[] | string; // Endereco pode ser um array de objetos Endereco ou uma string
    //     [key: string]: any; // Outras propriedades do formData
    //   }
      
    //   const endereco: Endereco = Array.isArray(formData.endereco) && formData.endereco.length > 0 ? formData.endereco[0] : {} as Endereco;
      
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
                <Grid container spacing={3} marginTop={"5px"} id="endereco-form" marginBottom={"70px"} ref={formRef} >
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
                            <FormLabel htmlFor="num-addresses">
                                Quantos endereços diferentes morou nos últimos 5 anos?
                            </FormLabel>
                            <OutlinedInput
                                id="num-addresses"
                                name="num-addresses"
                                type="number"
                                autoComplete="num-addresses"
                                // value={endereco.quantosEnderecosMorou || ""}
                                onChange={handleChange}
                                onBlur={handleInputBlur}
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
                            // value={endereco.cep || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12}>
                        <FormLabel htmlFor="rua" required>
                            Rua
                        </FormLabel>
                        <OutlinedInput
                            id="rua"
                            name="rua"
                            type="text"
                            autoComplete="rua"
                            required
                            // value={endereco.rua || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
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
                            // value={endereco.numero || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={4}>
                        <FormLabel htmlFor="complement">
                            Complemento
                        </FormLabel>
                        <OutlinedInput
                            id="complement"
                            name="complement"
                            type="text"
                            autoComplete="complement"
                            // value={endereco.complemento || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="cidade" required>
                            Cidade
                        </FormLabel>
                        <OutlinedInput
                            id="cidade"
                            name="cidade"
                            type="text"
                            autoComplete="cidade"
                            required
                            // value={endereco.cidade || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="bairro" required>
                            Bairro
                        </FormLabel>
                        <OutlinedInput
                            id="bairro"
                            name="bairro"
                            type="text"
                            autoComplete="bairro"
                            required
                            // value={endereco.bairro|| ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="uf" required>
                            UF
                        </FormLabel>
                        <OutlinedInput
                            id="uf"
                            name="uf"
                            type="text"
                            autoComplete="uf"
                            required
                            // value={endereco.uf   || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    {years.map((year) => (
                        <Grid item xs={12} md={6} key={year}>
                            <FormLabel htmlFor={`comprovante-${year}`}>
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
