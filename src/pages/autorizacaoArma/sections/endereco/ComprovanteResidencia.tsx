import React, { useEffect, useState } from "react";
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
    InputAdornment,
} from "@mui/material";
import CamposEndereco from "../hooks/CamposEndereco";
import { useProcesso } from "../context/useProcesso";
import { apiRequest } from "../../../../services/api/apiRequestService";
import CPFInput from "../utils/inputs/CPFInput";
import CEPInput from "../utils/inputs/CEPInput";

interface ComprovanteResidenciaProps {

}

const ComprovanteResidencia: React.FC<ComprovanteResidenciaProps> = () => {
    const { processoAggregate, setProcessoAggregate } = useProcesso();
    const [, setFiles] = useState<{ [key: number]: File | null }>({});
    const [fileNames, setFileNames] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        if (processoAggregate && processoAggregate.comprovantesResidencia) {
            const initialFileNames: { [key: number]: string } = {};

            processoAggregate.comprovantesResidencia.forEach((comprovante, index) => {
                if (comprovante.arquivo) {
                    initialFileNames[comprovante.ano!] = `Comprovante de ${comprovante.ano} enviado`; // Substitua pelo nome real se estiver disponível no backend
                }
            });

            setFileNames(initialFileNames);
        }
    }, [processoAggregate]);

    const handleFileChange = async (year: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert("Por favor, selecione um arquivo PNG, JPEG ou PDF.");
                return;
            }

            setFiles((prevFiles) => ({ ...prevFiles, [year]: file }));
            setFileNames((prevNames) => ({ ...prevNames, [year]: file.name }));

            const reader = new FileReader();
            reader.onload = async () => {
                const base64String = reader.result?.toString().split(',')[1];

                if (!base64String) {
                    alert("Erro ao processar o arquivo. Tente novamente.");
                    return;
                }

                const index = processoAggregate.comprovantesResidencia.findIndex(
                    (comprovante) => comprovante.ano === year
                );

                if (index === -1) {
                    alert(`Não foi possível encontrar o índice para o ano ${year}.`);
                    return;
                }

                const fileOperation = {
                    path: `comprovantesResidencia/${index}/arquivo`,
                    value: base64String,
                };

                try {
                    const response = await apiRequest({
                        method: 'PATCH',
                        endpoint: `/${processoAggregate.id}`,
                        data: [fileOperation],
                    });

                    console.log("Upload successful:", response.data);
                } catch (error) {
                    console.error("Erro ao enviar o arquivo:", error);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleChange = (ano: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const updatedComprovantesResidencia = processoAggregate.comprovantesResidencia.map((comprovante) => {
            if (comprovante.ano === ano) {
                if (["cep", "rua", "numero", "bairro", "cidade", "uf", "complemento"].includes(name)) {
                    return {
                        ...comprovante,
                        dadosTitular: {
                            ...comprovante.dadosTitular,
                            endereco: {
                                ...comprovante.dadosTitular.endereco,
                                [name]: value,
                            },
                        },
                    };
                } else {
                    return {
                        ...comprovante,
                        dadosTitular: {
                            ...comprovante.dadosTitular,
                            [name]: value,
                        },
                    };
                }
            }
            return comprovante;
        });

        const updatedProcessoAggregate = {
            ...processoAggregate,
            comprovantesResidencia: updatedComprovantesResidencia,
        };

        setProcessoAggregate(updatedProcessoAggregate);
    };

    const handleBlur = (ano: number) => async (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        const index = processoAggregate.comprovantesResidencia.findIndex(comprovante => comprovante.ano === ano);

        if (index >= 0 && processoAggregate.id) {
            let path;

            if (["cep", "rua", "numero", "bairro", "cidade", "uf", "complemento"].includes(name)) {
                path = `comprovantesResidencia/${index}/dadosTitular/endereco/${name}`;
            } else {
                path = `comprovantesResidencia/${index}/dadosTitular/${name}`;
            }

            const operations = [
                {
                    path,
                    value,
                },
            ];

            try {
                const response = await apiRequest({
                    method: 'PATCH',
                    endpoint: `/${processoAggregate.id}`,
                    data: operations,
                });
                console.log("Patch response", response);
            } catch (error) {
                console.error("Erro ao salvar os dados:", error);
            }
        }
    };

    const handleTitularChange = async (ano: number, valor: string) => {

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

        const index = processoAggregate.comprovantesResidencia.findIndex(comprovante => comprovante.ano === ano);

        if (index === -1) {
            console.error(`Comprovante para o ano ${ano} não encontrado.`);
            return;
        }

        const path = `comprovantesResidencia/${index}/titular`;

        const operations = [
            {
                path,
                value: valor === 'sim',
            },
        ];

        try {
            const response = await apiRequest({
                method: 'PATCH',
                endpoint: `/${processoAggregate.id}`,
                data: operations,
            });
            console.log("Titular change saved:", response.data);
        } catch (error) {
            console.error("Erro ao salvar o titular:", error);
        }
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
                            sx={{
                                mr: 1,
                                marginTop: '5px',
                                marginBottom: '15px',
                                display: "flex",
                                width: "100px",
                                height: "50px",
                                justifyContent: "center"

                            }}
                        >
                            {comprovante.ano}
                            <input
                                type="file"
                                id={`comprovante-${comprovante.ano}`}
                                name={`comprovante-${comprovante.ano}`}
                                onChange={(event) => handleFileChange(comprovante.ano!, event)} // Passando year e event
                                hidden
                                accept=".png, .jpeg, .jpg, .pdf"
                            />
                        </Button>
                        {comprovante.ano !== null && comprovante.ano !== undefined && fileNames[comprovante.ano] && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {fileNames[comprovante.ano]}
                            </Typography>
                        )}
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
                                name={`titular-${comprovante.ano}`}
                                value={comprovante.titular ? 'sim' : 'nao'}
                                onChange={(e) => handleTitularChange(comprovante.ano!, e.target.value)}
                            >
                                <FormControlLabel value="sim" control={<Radio />} label="Sim" />
                                <FormControlLabel value="nao" control={<Radio />} label="Não" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    {!comprovante.titular && (
                        <Grid container spacing={2} sx={{ paddingLeft: '10px' }}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor={`nome-${comprovante.ano}`}>Nome</FormLabel>
                                    <OutlinedInput
                                        id={`nome`}
                                        name={`nome`}
                                        placeholder="Nome completo do titular"
                                        value={comprovante.dadosTitular?.nome || ""}
                                        onChange={handleChange(comprovante.ano!)}
                                        onBlur={handleBlur(comprovante.ano!)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor={`rg-${comprovante.ano}`}>RG</FormLabel>
                                    <OutlinedInput
                                        id={`rg`}
                                        name={`rg`}
                                        placeholder="RG do titular"
                                        value={comprovante.dadosTitular?.rg || ""}
                                        onChange={handleChange(comprovante.ano!)}
                                        onBlur={handleBlur(comprovante.ano!)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <CPFInput
                                        name={`cpf`}
                                        value={comprovante.dadosTitular?.cpf || ""}
                                        onChange={handleChange(comprovante.ano!)}
                                        onBlur={handleBlur(comprovante.ano!)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CEPInput
                                        name={`cep`}
                                        value={comprovante.dadosTitular?.endereco.cep || ""}
                                        onChange={handleChange(comprovante.ano!)}
                                        onBlur={handleBlur(comprovante.ano!)}
                                        endAdornment={ 
                                            <InputAdornment position="end">
                                                <Tooltip title="Preencha o endereço exatamente como consta no comprovante de residência do titular." arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            color: 'text.secondary',
                                                            cursor: 'help',
                                                            fontSize: '1.2rem',
                                                            ml: 1,
                                                        }}
                                                    >
                                                        ⓘ
                                                    </Typography>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <CamposEndereco
                                    endereco={comprovante.dadosTitular?.endereco || {
                                        cep: "",
                                        rua: "",
                                        numero: "",
                                        bairro: "",
                                        cidade: "",
                                        uf: "",
                                        complemento: "",
                                    }
                                    }
                                    handleInputChange={handleChange(comprovante.ano!)}
                                    handleInputBlur={handleBlur(comprovante.ano!)}
                                    mostrarCep={false}
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