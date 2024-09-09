import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from '@mui/icons-material/Refresh';
import Collapse from "@mui/material/Collapse";
import Box from '@mui/material/Box';
import { apiRequest } from '../../services/api/apiRequestService';
import { gerarPdf } from "../../services/pdf/gerarPDFsBasicos";
import axios from "axios";
import { keyframes } from '@mui/system';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const findCep = async (cep: String) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        return null;
    }
};

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
    formData: { [key: string]: any };
    setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>;
    uuid: string | null;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Endereco: React.FC<EnderecoProps> = ({ isVisible, onToggle, onFilled, formData, uuid, setFormData, setPdfUrls, setActiveStep }) => {
    const [filled, setFilled] = useState(false);
    const [open, setOpen] = useState(isVisible);
    const [sameAddress, setSameAddress] = useState('yes');
    const [dirty, setDirty] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [, setFiles] = useState<{ [key: number]: File | null }>({});
    const [loading, setLoading] = useState(false);

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
                    if (open) {
                        setOpen(false);
                        setActiveStep(2);
                        gerarPdf(formData, uuid, setPdfUrls);
                    }
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filled, dirty, formData, uuid]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        setDirty(true);
    };

    const handleToggle = () => {
        setOpen(!open);
        onToggle();
    };

    const handleInputBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let updatedFormData = {
            ...formData,
            endereco: {
                ...formData.endereco,
                [name]: value,
            }
        };

        if (name === "cep" && value.replace("-", "").length === 8) {
            setLoading(true);
            const endereco = await findCep(value);
            setLoading(false);
            if (endereco) {
                updatedFormData = {
                    ...updatedFormData,
                    endereco: {
                        ...updatedFormData.endereco,
                        rua: endereco.logradouro || "",
                        bairro: endereco.bairro || "",
                        cidade: endereco.localidade || "",
                        uf: endereco.uf || "",
                        cep: endereco.cep || value,
                    }
                };
            }
        }

        setFormData(updatedFormData);

        if (uuid) {
            localStorage.setItem(`form-data-${uuid}`, JSON.stringify({ uuid, ...updatedFormData }));
            apiRequest({
                tipo: "endereco",
                data: {
                    uuid,
                    ...updatedFormData,
                },
            }).catch(error => console.error(error));
        }
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedFormData = {
            ...formData,
            endereco: {
                ...formData.endereco,
                [name]: value,
            }
        };
        setFormData(updatedFormData);
        if (uuid) {
            localStorage.setItem(`form-data-${uuid}`, JSON.stringify({ uuid, ...updatedFormData }));
        }
    };

    return (
        <div>
            <Box sx={{ my: 2 }}>
                <Grid container alignItems="center"
                    sx={{
                        borderColor: 'primary.light',
                        '&:hover': { background: '#E3DFDC' },
                        borderRadius: "5px",
                        cursor: 'pointer',
                        padding: '10px', // Adiciona padding para melhorar a aparência
                    }}
                    onClick={handleToggle}

                >

                    <Grid item xs={11}>
                        <Typography variant="h5" component="h2" color={"#1465C0"} align='center'>
                            Endereço
                        </Typography>
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
                                value={(formData.endereco as unknown as { [key: string]: string })?.["quantosEnderecosMorou"] || ""}
                                onChange={handleChange}
                                onBlur={handleInputBlur}
                            />
                        </FormGrid>
                    )}
                    <FormGrid item xs={12} md={6}>
                        <FormLabel htmlFor="cep" required style={{ marginTop: "22px" }}>
                            CEP
                        </FormLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <OutlinedInput
                                id="cep"
                                name="cep"
                                type="text"
                                autoComplete="cep"
                                required
                                value={(formData.endereco as unknown as { [key: string]: string })?.["cep"] || ""}
                                onChange={handleChange}
                                onBlur={handleInputBlur}
                                sx={{ flexGrow: 1 }}
                            />
                            <RefreshIcon sx={{ visibility: loading ? 'visible' : 'hidden', animation: `${spin} 0.8s linear infinite` }} />
                        </Box>
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
                            value={(formData.endereco as unknown as { [key: string]: string })?.["rua"] || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={2}>
                        <FormLabel htmlFor="numero" required>
                            Nº
                        </FormLabel>
                        <OutlinedInput
                            id="numero"
                            name="numero"
                            type="text"
                            autoComplete="numero"
                            required
                            value={(formData.endereco as unknown as { [key: string]: string })?.["numero"] || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <FormGrid item xs={12} md={4}>
                        <FormLabel htmlFor="complemento">
                            Complemento
                        </FormLabel>
                        <OutlinedInput
                            id="complemento"
                            name="complemento"
                            type="text"
                            autoComplete="complemento"
                            value={(formData.endereco as unknown as { [key: string]: string })?.["complemento"] || ""}
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
                            value={(formData.endereco as unknown as { [key: string]: string })?.["cidade"] || ""}
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
                            value={(formData.endereco as unknown as { [key: string]: string })?.["bairro"] || ""}
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
                            value={(formData.endereco as unknown as { [key: string]: string })?.["uf"] || ""}
                            onChange={handleChange}
                            onBlur={handleInputBlur}
                        />
                    </FormGrid>
                    <Grid item xs={12}>
                        <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Caso queira que preparemos o documento
                            <Typography variant="overline" sx={{ pl: 1, color: 'text.primary', fontWeight: "bold" }}>
                                "1. Comprovante de residência fixa referente aos locais de domicílio dos últimos cinco anos"
                            </Typography>
                            , faça o upload de imagem ou pdf para cada um dos anos abaixo. Com isso, conseguiremos gerar um documento a mais para você, de forma unificada e comprimida para caber no tamanho máximo permitido pelo SisGCorp!
                        </Typography>
                        <br />
                        {years.map((year) => (
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ mr: 1, marginTop: '5px' }}
                            >
                                {year}
                                <input
                                    type="file"
                                    id={`comprovante-${year}`}
                                    name={`comprovante-${year}`}
                                    onChange={(e) => handleFileChange(year, e, setFiles)}
                                    hidden
                                />
                            </Button>
                        ))}
                    </Grid>
                </Grid>
            </Collapse>
        </div>
    );
};

export default Endereco;
