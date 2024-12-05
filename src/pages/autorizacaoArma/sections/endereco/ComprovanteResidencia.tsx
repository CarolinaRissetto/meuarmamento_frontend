import React, { useState } from "react";
import {
    Grid,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    OutlinedInput,
    Typography,
    Tooltip,
    Box,
} from "@mui/material";
import CamposEndereco from "../hooks/CamposEndereco";
import { useProcesso } from "../context/useProcesso";
import { apiRequest } from "../../../../services/api/apiRequestService";
import { ComprovanteResidenciaEntity } from "../../domain/ComprovanteResidenciaEntity";

interface ComprovanteResidenciaProps {

}

const ComprovanteResidencia: React.FC<ComprovanteResidenciaProps> = ({ }) => {
    const [titular, setTitular] = useState<{ [year: number]: string }>({});
    const { processoAggregate, setProcessoAggregate } = useProcesso();
    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [, setFiles] = useState<{ [key: number]: File | null }>({});

    const handleFileChange = (
        year: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            setFiles((prevFiles) => ({
                ...prevFiles,
                [year]: event.target.files![0],
            }));
        }
    };


    const handleChange = (ano: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
    
        setProcessoAggregate((prev) => {
            const comprovantesResidencia = prev.comprovantesResidencia.map((comprovante) => {
                if (comprovante.ano === ano) {
                    // Clonar o comprovante atual
                    const updatedComprovante: ComprovanteResidenciaEntity = { ...comprovante };
    
                    // Inicializar dadosTitular se estiver undefined
                    const dadosTitular = updatedComprovante.dadosTitular || {
                        nome: null,
                        rg: null,
                        cpf: null,
                        endereco: {
                            cep: null,
                            rua: null,
                            complemento: null,
                            numero: null,
                            bairro: null,
                            cidade: null,
                            uf: null,
                        },
                    };
    
                    // Se for um campo de endereço
                    if (name.startsWith("endereco.")) {
                        const enderecoField = name.split(".")[1];
    
                        // Inicializar endereco se estiver undefined
                        const endereco = dadosTitular.endereco || {
                            cep: null,
                            rua: null,
                            complemento: null,
                            numero: null,
                            bairro: null,
                            cidade: null,
                            uf: null,
                        };
    
                        // Atualizar o campo específico do endereço
                        updatedComprovante.dadosTitular = {
                            ...dadosTitular,
                            endereco: {
                                ...endereco,
                                [enderecoField]: value || null, // Garante que não seja undefined
                            },
                        };
                    } else {
                        // Atualizar o campo específico de dadosTitular
                        updatedComprovante.dadosTitular = {
                            ...dadosTitular,
                            [name]: value || null, // Garante que não seja undefined
                        };
                    }
    
                    return updatedComprovante;
                }
                return comprovante;
            });
    
            return { ...prev, comprovantesResidencia };
        });
    };
    
    const handleBlur = (ano: number) => async (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        try {
            setProcessoAggregate((prev) => {
                const comprovantesResidencia = prev.comprovantesResidencia.map((comprovante) => {
                    if (comprovante.ano === ano) {
                        const updatedComprovante: ComprovanteResidenciaEntity = { ...comprovante };

                        // if (name.startsWith("endereco.")) {
                        //     const enderecoField = name.split(".")[1];
                        //     updatedComprovante.dadosTitular = {
                        //         ...comprovante.dadosTitular,
                        //         endereco: {
                        //             ...comprovante.dadosTitular?.endereco,
                        //             [enderecoField]: value || null,
                        //         },
                        //     };
                        // } else {
                        //     updatedComprovante.dadosTitular = {
                        //         ...comprovante.dadosTitular,
                        //         [name]: value || null,
                        //     };
                        // }

                        return updatedComprovante;
                    }
                    return comprovante;
                });

                return { ...prev, comprovantesResidencia };
            });

            const comprovante = processoAggregate.comprovantesResidencia.find((c) => c.ano === ano);

            if (comprovante) {
                const payload = {
                    ano: comprovante.ano,
                    arquivo: comprovante.arquivo,
                    titular: comprovante.titular,
                    dadosTitular: comprovante.titular
                        ? null
                        : {
                            nome: comprovante.dadosTitular?.nome,
                            rg: comprovante.dadosTitular?.rg,
                            cpf: comprovante.dadosTitular?.cpf,
                            endereco: comprovante.dadosTitular?.endereco,
                        },
                };

                await apiRequest({
                    method: "PATCH",
                    endpoint: `/processo/${processoAggregate.id}/comprovantes-residencia`,
                    data: payload,
                });
            }
        } catch (error) {
            console.error("Erro ao salvar o campo:", error);
        }
    };
    
    const handleTitularChange = (ano: number, valor: string) => {
        setTitular((prev) => ({
            ...prev,
            [ano]: valor,
        }));

        setProcessoAggregate((prev) => {
            const comprovantesResidencia = prev.comprovantesResidencia.map((comprovante) => {
                if (comprovante.ano === ano) {
                    return {
                        ...comprovante,
                        titular: valor === 'sim',
                    };
                }
                return comprovante;
            });
            return { ...prev, comprovantesResidencia };
        });
    };

    return (
        <Grid container spacing={3} marginLeft={'20px'}>
            <Typography sx={{ color: 'text.secondary', mt: 0.5, marginBottom: '40px', }}>
                Caso queira que preparemos o documento
                <Typography variant="overline" sx={{ pl: 1, color: 'text.primary', fontWeight: "bold" }}>
                    "1. Comprovante de residência fixa referente aos locais de domicílio dos últimos cinco anos"
                </Typography>
                , faça o upload de imagem ou pdf para cada um dos anos abaixo. Com isso, conseguiremos gerar um documento a mais para você, de forma unificada e comprimida para caber no tamanho máximo permitido pelo SisGCorp!
            </Typography>
            <br />
            {processoAggregate.comprovantesResidencia.map((comprovante) => (
                <Grid container key={comprovante.ano} alignItems="center" spacing={1} sx={{ marginBottom: '30px', width: '720px' }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{ mr: 1, marginTop: '5px', marginBottom: '15px', display: "flex", width: "100px", height: "50px" }}
                        >
                            {ano}
                            <input
                                type="file"
                                id={`comprovante-${ano}`}
                                name={`comprovante-${ano}`}
                                onChange={(event) => handleFileChange(ano, event)} // Passando year e event
                                hidden
                                accept=".png, .jpeg, .jpg, .pdf"
                            />
                        </Button>
                    </Grid>
                    <Grid item sx={{ marginLeft: '10px' }}>
                        <FormControl>
                            <FormLabel>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    É o titular da conta?
                                    <Tooltip title="Caso o comprovante não esteja no seu nome, vamos gerar um documento extra para você. Ele deverá ser assinado pelo titular.">
                                        <Typography
                                            component="span"
                                            sx={{ color: 'text.secondary', cursor: 'help', fontSize: '1.2rem' }}
                                        >
                                            ⓘ
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            </FormLabel>
                            <RadioGroup
                                row
                                name={`titular-${ano}`}
                                onChange={(e) => handleTitularChange(ano, e.target.value)}
                            >
                                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                <FormControlLabel value="nao" control={<Radio />} label="Não" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {titular[ano] === "nao" && (
                        <Grid container spacing={2} sx={{ paddingLeft: '10px' }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor={`nome-${ano}`}>Nome</FormLabel>
                                    <OutlinedInput
                                        id={`nome-${ano}`}
                                        name={`nome-${ano}`}
                                        placeholder="Nome completo do titular"
                                        value={
                                            processoAggregate.comprovantesResidencia.find(
                                                (comprovante) => comprovante.ano === ano
                                            )?.dadosTitular?.nome || ""
                                        }
                                        onChange={handleChange(ano)}
                                        onBlur={handleBlur(ano)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor={`rg-${ano}`}>RG</FormLabel>
                                    <OutlinedInput
                                        id={`rg-${ano}`}
                                        name={`rg-${ano}`}
                                        placeholder="RG do titular"
                                        value={
                                            processoAggregate.comprovantesResidencia.find(
                                                (comprovante) => comprovante.ano === ano
                                            )?.dadosTitular?.rg || ""
                                        }
                                        onChange={handleChange(ano)}
                                        onBlur={handleBlur(ano)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor={`cpf-${ano}`}>CPF</FormLabel>
                                    <OutlinedInput
                                        id={`cpf-${ano}`}
                                        name={`cpf-${ano}`}
                                        placeholder="CPF do titular"
                                        value={
                                            processoAggregate.comprovantesResidencia.find(
                                                (comprovante) => comprovante.ano === ano
                                            )?.dadosTitular?.cpf || ""
                                        }
                                        onChange={handleChange(ano)}
                                        onBlur={handleBlur(ano)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <CamposEndereco
                                    endereco={
                                        processoAggregate.comprovantesResidencia.find((comprovante) => comprovante.ano === ano)?.dadosTitular?.endereco || {
                                            cep: "",
                                            rua: "",
                                            numero: "",
                                            bairro: "",
                                            cidade: "",
                                            uf: "",
                                            complemento: "",
                                        }
                                    }
                                    handleInputChange={handleChange(ano)}
                                    handleInputBlur={handleBlur(ano)}
                                    mostrarTooltipCep={true}
                                />
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            ))}
        </Grid>
    );
};

export default ComprovanteResidencia;