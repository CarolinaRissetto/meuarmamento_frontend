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
import { ProcessoAggregate, isEnderecoFilled } from '../domain/ProcessoAggregate';
import CEPInput from './utils/inputs/CEPInput';

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

const findCep = async (cep: string) => {
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
    processoAggregate: ProcessoAggregate;
    setProcessoAggregate: React.Dispatch<React.SetStateAction<ProcessoAggregate>>;
    setPdfUrls: React.Dispatch<React.SetStateAction<{ [key: string]: { url: string | null; status: string | null; }; }>>;
    uuid: string | null;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    carregandoDadosIniciais: boolean;
}

const Endereco: React.FC<EnderecoProps> = ({
    visibilidadeSessao,
    alternarVisibilidadeSessao,
    fecharSessaoPreenchida,
    processoAggregate,
    setProcessoAggregate,
    uuid,
    setPdfUrls,
    carregandoDadosIniciais
}) => {
    const [sessaoAberta, setSessaoAberta] = useState(visibilidadeSessao);
    const [sameAddress, setSameAddress] = useState('yes');
    const [dirty, setDirty] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [, setFiles] = useState<{ [key: number]: File | null }>({});
    const [buscandoEndereco, setBuscandoEndereco] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const numeroInputRef = useRef<HTMLInputElement>(null);
    const ruaInputRef = useRef<HTMLInputElement>(null);
    const [focusField, setFocusField] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasMounted = useRef(false);

    useEffect(() => {
        setSessaoAberta(visibilidadeSessao);
    }, [visibilidadeSessao]);

    useEffect(() => {
        if (!carregandoDadosIniciais) {
            hasMounted.current = true;
        }
    }, [carregandoDadosIniciais]);

    useEffect(() => {
        if (dirty && isEnderecoFilled(processoAggregate.endereco) && sessaoAberta) {

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                fecharSessaoPreenchida();
                setSnackbarOpen(true);
                gerarPdfsTemplates(uuid, setPdfUrls, processoAggregate, setProcessoAggregate);
                gerarCertidaoJusticaEstadual(uuid, setPdfUrls, processoAggregate, setProcessoAggregate);
                setDirty(false);
            }, 2500);
        }
    }, [processoAggregate, dirty, sessaoAberta, fecharSessaoPreenchida, setPdfUrls, setProcessoAggregate, uuid]);

    useEffect(() => {
        if (focusField === 'numero' && numeroInputRef.current) {
            numeroInputRef.current.focus();
            setFocusField(null);
        } else if (focusField === 'rua' && ruaInputRef.current) {
            ruaInputRef.current.focus();
            setFocusField(null);
        }
    }, [focusField]);

    const handleInputBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === "cep" && !validarCEP(value)) {
            return;
        }

        const updatedProcessoAggregate = await buscarEnderecoPorCep(name, value, processoAggregate);

        setProcessoAggregate(updatedProcessoAggregate);

        if (uuid) {
            apiRequest({
                tipo: "endereco",
                data: {
                    uuid,
                    ...updatedProcessoAggregate,
                },
            }).catch(error => console.error(error));
        }
    };

    const validarCEP = (cep: string): boolean => {
        const regex = /^\d{5}-\d{3}$/;
        return regex.test(cep);
    };

    const buscarEnderecoPorCep = async (name: string, value: string, processoAggregate: ProcessoAggregate) => {
        if (name === "cep" && validarCEP(value)) {
            setBuscandoEndereco(true);
            const endereco = await findCep(value);
            setBuscandoEndereco(false);

            if (endereco) {
                const updatedProcessoAggregate = {
                    ...processoAggregate,
                    endereco: {
                        ...processoAggregate.endereco,
                        rua: endereco.logradouro || "",
                        bairro: endereco.bairro || "",
                        cidade: endereco.localidade || "",
                        uf: endereco.uf || "",
                        cep: endereco.cep || value,
                    }
                };

                if (endereco.logradouro) {
                    setFocusField('numero');
                } else {
                    setFocusField('rua');
                }
                return updatedProcessoAggregate;
            }
        }

        return processoAggregate;
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const previousValue = processoAggregate.endereco[name as keyof typeof processoAggregate.endereco];

        if (previousValue !== value && hasMounted.current) {
            setDirty(true);
        }

        const updatedProcessoAggregate = {
            ...processoAggregate,
            endereco: {
                ...processoAggregate.endereco,
                [name]: value,
            },
        };

        setProcessoAggregate(updatedProcessoAggregate);
    };

    return (
        <div>
            <Box sx={{ my: 2 }}>
                <Grid container alignItems="center"
                    sx={{
                        borderColor: 'primary.light',
                        background: 'primary.light',
                        '&:hover': {
                            background: '#E3DFDC',
                        }, borderRadius: "5px",
                        cursor: 'pointer',
                        padding: '10px',
                    }}
                    onClick={alternarVisibilidadeSessao}
                >
                    <Grid item xs={11}>
                        <Typography variant="h5" component="h2" color={"#211f50"} align='center'>
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
                            onChange={(e) => setSameAddress((e.target as HTMLInputElement).value)}
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
                                name="quantosEnderecosMorou"
                                type="number"
                                autoComplete="num-addresses"
                                value={processoAggregate.endereco.quantosEnderecosMorou || ""}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                disabled={buscandoEndereco}
                            />
                        </FormGrid>
                    )}
                    <FormGrid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CEPInput
                                name="cep"
                                value={processoAggregate.endereco.cep || ""}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                            />
                            <RefreshIcon sx={{ visibility: buscandoEndereco ? 'visible' : 'hidden', animation: `${spin} 0.8s linear infinite` }} />
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
                            value={processoAggregate.endereco.rua || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            disabled={buscandoEndereco}
                            inputRef={ruaInputRef}
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
                            value={processoAggregate.endereco.numero || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            disabled={buscandoEndereco}
                            inputRef={numeroInputRef}
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
                            value={processoAggregate.endereco.complemento || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            disabled={buscandoEndereco}
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
                            value={processoAggregate.endereco.cidade || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            disabled={buscandoEndereco}
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
                            value={processoAggregate.endereco.bairro || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            disabled={buscandoEndereco}
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
                            value={processoAggregate.endereco.uf || ""}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            disabled={buscandoEndereco}
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
                                key={year}
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
