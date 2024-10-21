import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Collapse,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    OutlinedInput,
    Radio,
    RadioGroup,
    Typography,
    styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RefreshIcon from '@mui/icons-material/Refresh';
import { keyframes } from '@mui/system';
import { apiRequest } from '../../../services/api/apiRequestService';
import { gerarPdfsTemplates } from "../../../services/pdf/gerarPDFsTemplates";
import axios from "axios";
import { gerarCertidaoJusticaEstadual } from "../../../services/pdf/gerarCertidaoJusticaEstadual";
import CustomSnackbar from './utils/CustomSnackbar';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const FormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));

const findCep = async (cep: String) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        return null;
    }
};

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
    visibilidadeSessao: boolean;
    alternarVisibilidadeSessao: () => void;
    fecharSessaoPreenchida: () => void;
    formData: { [key: string]: any };
    setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>;
    uuid: string | null;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Endereco: React.FC<EnderecoProps> = ({ visibilidadeSessao, alternarVisibilidadeSessao, fecharSessaoPreenchida, formData, uuid, setFormData, setPdfUrls }) => {
    const [sessaoAberta, setSessaoAberta] = useState(visibilidadeSessao);
    const [sameAddress, setSameAddress] = useState('yes');
    const [dirty, setDirty] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [, setFiles] = useState<{ [key: number]: File | null }>({});
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSameAddress((event.target as HTMLInputElement).value);
    };

    useEffect(() => {
        setSessaoAberta(visibilidadeSessao);
    }, [visibilidadeSessao]);

    const isFormFilled = () => {
        const inputs = document.querySelectorAll("#endereco-form input[required]");
        for (let i = 0; i < inputs.length; i++) {
            if (!(inputs[i] as HTMLInputElement).value) {
                return false;
            }
        }
        return true;
    };

    const handleToggle = () => {
        alternarVisibilidadeSessao();
    };

    useEffect(() => {
        if (!dirty || !isFormFilled()) return;

        const timer = setTimeout(() => {
            const activeElement = document.activeElement;

            if (activeElement instanceof HTMLElement) {
                activeElement.blur();
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [formData, dirty]);


    const handleInputBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const updatedFormData = await buscarEnderecoPorCep(name, value, formData);

        setFormData(updatedFormData);

        if (uuid) {
            apiRequest({
                tipo: "endereco",
                data: {
                    uuid,
                    ...updatedFormData,
                },
            }).catch(error => console.error(error));
        }

        if (isFormFilled() && dirty) {
            if (sessaoAberta) {
                fecharSessaoPreenchida();
                setSnackbarOpen(true);
                gerarPdfsTemplates(formData, uuid, setPdfUrls, setFormData);
                gerarCertidaoJusticaEstadual(formData, setFormData, setPdfUrls, uuid);
                setDirty(false)
            }
        }
    };

    const buscarEnderecoPorCep = async (name: string, value: string, formData: any) => {
        if (name === "cep" && value.replace("-", "").length === 8) {
            setLoading(true);
            const endereco = await findCep(value);
            setLoading(false);

            if (endereco) {
                const updatedFormData = {
                    ...formData,
                    endereco: {
                        ...formData.endereco,
                        rua: endereco.logradouro || "",
                        bairro: endereco.bairro || "",
                        cidade: endereco.localidade || "",
                        uf: endereco.uf || "",
                        cep: endereco.cep || value,
                    }
                };

                return updatedFormData;
            }
        }

        return formData;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const valorAnterior = formData[name as keyof typeof formData];

        if (valorAnterior !== value) {
            setDirty(true);
        }

        const updatedFormData = {
            ...formData,
            endereco: {
                ...formData.endereco,
                [name]: value,
            }
        };

        setFormData(updatedFormData);
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
                        padding: '10px',
                    }}
                    onClick={handleToggle}
                >
                    <Grid item xs={11}>
                        <Typography variant="h5" component="h2" color={"#1465C0"} align='center'>
                            Endereço
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton>
                            {sessaoAberta ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
            <Collapse in={sessaoAberta}>
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
                                onChange={handleInputChange}
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
                                placeholder="Cep"
                                required
                                value={(formData.endereco as unknown as { [key: string]: string })?.["cep"] || ""}
                                onChange={handleInputChange}
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
                            placeholder="Rua"
                            required
                            value={(formData.endereco as unknown as { [key: string]: string })?.["rua"] || ""}
                            onChange={handleInputChange}
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
                            placeholder="Número"
                            required
                            value={(formData.endereco as unknown as { [key: string]: string })?.["numero"] || ""}
                            onChange={handleInputChange}
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
                            placeholder="Complemento"
                            autoComplete="complemento"
                            value={(formData.endereco as unknown as { [key: string]: string })?.["complemento"] || ""}
                            onChange={handleInputChange}
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
                            placeholder="Cidade"
                            required
                            value={(formData.endereco as unknown as { [key: string]: string })?.["cidade"] || ""}
                            onChange={handleInputChange}
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
                            placeholder="Bairro"
                            required
                            value={(formData.endereco as unknown as { [key: string]: string })?.["bairro"] || ""}
                            onChange={handleInputChange}
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
                            placeholder="UF"
                            required
                            value={(formData.endereco as unknown as { [key: string]: string })?.["uf"] || ""}
                            onChange={handleInputChange}
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
            <CustomSnackbar
                snackbarOpen={snackbarOpen}
                setSnackbarOpen={setSnackbarOpen}
                message="Iniciando a geração de mais 3 documentos..."
                severity="success"
            />
        </div>
    );
};

export default Endereco;
