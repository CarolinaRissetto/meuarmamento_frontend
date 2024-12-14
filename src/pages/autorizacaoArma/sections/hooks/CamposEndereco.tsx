import React from "react";
import { Grid, FormLabel, OutlinedInput, Box, styled, Typography, Tooltip } from "@mui/material";
import { EnderecoEntity } from "../../domain/EnderecoEntity";
import CEPInput from "../utils/inputs/CEPInput";
import RefreshIcon from "@mui/icons-material/Refresh";
import { keyframes } from '@mui/system';

interface CamposEnderecoProps {
    endereco: EnderecoEntity;
    handleInputChange: (evento: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputBlur: (evento: React.FocusEvent<HTMLInputElement>) => void;
    buscandoEndereco?: boolean;
    formRef?: React.RefObject<HTMLDivElement>;
    numeroInputRef?: React.RefObject<HTMLInputElement>;
    ruaInputRef?: React.RefObject<HTMLInputElement>;
    mostrarCep?: boolean;
}

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


const CamposEndereco: React.FC<CamposEnderecoProps> = ({
    endereco,
    handleInputChange,
    handleInputBlur,
    buscandoEndereco = false,
    numeroInputRef,
    ruaInputRef,
    mostrarCep = true,
}) => {
    return (
        <Grid container spacing={2}>
            {mostrarCep && (
                <FormGrid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CEPInput
                                name="cep"
                                value={endereco.cep || ""}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                            />
                            <RefreshIcon sx={{ visibility: buscandoEndereco ? 'visible' : 'hidden', animation: `${spin} 0.8s linear infinite` }} />
                        </Box>
                    </Box>
                </FormGrid>
            )}
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
                    value={endereco.rua || ""}
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
                    value={endereco.numero || ""}
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
                    value={endereco.complemento || ""}
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
                    value={endereco.cidade || ""}
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
                    value={endereco.bairro || ""}
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
                    value={endereco.uf || ""}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    disabled={buscandoEndereco}
                />
            </FormGrid>
        </Grid>
    );
};

export default CamposEndereco;
