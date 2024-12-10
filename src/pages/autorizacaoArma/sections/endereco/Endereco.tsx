import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Box,
    Collapse,
    Grid,
    IconButton,
    styled,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { apiRequest } from '../../../../services/api/apiRequestService';
import axios from "axios";
import CustomSnackbar from '../utils/CustomSnackbar';
import { ProcessoAggregate, isEnderecoFilled } from '../../domain/ProcessoAggregate';
import { useProcesso } from "../context/useProcesso";
import useAutoSave from "../hooks/useAutoSave";
import CamposEndereco from "../hooks/CamposEndereco";

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

interface EnderecoProps {
    visibilidadeSessao: boolean;
    alternarVisibilidadeSessao: () => void;
    fecharSessaoPreenchida: () => void;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    carregandoDadosIniciais: boolean;
}

const Endereco: React.FC<EnderecoProps> = ({
    visibilidadeSessao,
    alternarVisibilidadeSessao,
    fecharSessaoPreenchida,
    carregandoDadosIniciais
}) => {
    const { processoAggregate, setProcessoAggregate } = useProcesso();
    const [sessaoAberta, setSessaoAberta] = useState(visibilidadeSessao);
    const [dirty, setDirty] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const [buscandoEndereco, setBuscandoEndereco] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const numeroInputRef = useRef<HTMLInputElement>(null);
    const ruaInputRef = useRef<HTMLInputElement>(null);
    const [focusField, setFocusField] = useState<string | null>(null);
    const hasMounted = useRef(false);

    useAutoSave({
        isFilled: isEnderecoFilled(processoAggregate.endereco),
        isDirty: dirty,
        isOpen: sessaoAberta,
        hasMounted,
        processoId: processoAggregate.id,
        fecharSessaoPreenchida,
        setSnackbarOpen,
        setIsDirty: setDirty
    });

    useEffect(() => {
        setSessaoAberta(visibilidadeSessao);
    }, [visibilidadeSessao]);

    useEffect(() => {
        if (!carregandoDadosIniciais) {
            hasMounted.current = true;
        }
    }, [carregandoDadosIniciais]);

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
        if (!event || !event.target) {
            console.error('handleInputBlur chamado sem um evento válido.');
            return;
        }
        const { name, value } = event.target;

        await apiRequest({
            method: 'PATCH',
            endpoint: `/${processoAggregate.id}`,
            path: `/endereco/${name}`,
            data: value
        });

        if (name === "cep" && !validarCEP(value)) {
            return;
        }

        const updatedProcessoAggregate = await buscarEnderecoPorCep(name, value, processoAggregate);

        setProcessoAggregate(updatedProcessoAggregate);

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

                const updates = [
                    { path: "/endereco/rua", value: endereco.logradouro || "" },
                    { path: "/endereco/bairro", value: endereco.bairro || "" },
                    { path: "/endereco/cidade", value: endereco.localidade || "" },
                    { path: "/endereco/uf", value: endereco.uf || "" },
                    { path: "/endereco/cep", value: endereco.cep || value },
                ];

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

                await apiRequest({
                    method: 'PATCH',
                    endpoint: `/${processoAggregate.id}`,
                    data: updates,
                });

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
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            maxWidth: '800px', // Define a largura máxima para a seção
                            margin: '0 auto', // Centraliza a seção horizontalmente
                            padding: '20px', // Adiciona padding interno
                            marginBottom: '70px', // Mantém o espaçamento inferior
                        }}
                        id="endereco-form"
                        ref={formRef}
                    >
                        <FormGrid container spacing={3}>
                            <CamposEndereco
                                endereco={processoAggregate.endereco}
                                handleInputChange={handleInputChange}
                                handleInputBlur={handleInputBlur}
                                buscandoEndereco={buscandoEndereco}
                                formRef={formRef}
                                numeroInputRef={numeroInputRef}
                                ruaInputRef={ruaInputRef}
                            />
                        </FormGrid>
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
