import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    OutlinedInput,
    FormLabel,
} from '@mui/material';
import TelefoneInput from '../../pages/autorizacaoArma/sections/utils/inputs/TelefoneInput';
import { LeadData } from '../../pages/autorizacaoArma/domain/LeadData';

interface ModalColetaLeadProps {
    modalOpen: boolean;
    handleModalClose: () => void;
    onSubmit: (data: LeadData) => void;
}

export const ModalColetaLead: React.FC<ModalColetaLeadProps> = ({ modalOpen, handleModalClose, onSubmit }) => {
    const [leadData, setLeadData] = useState<LeadData>({
        nome: '',
        telefone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLeadData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (leadData.nome && leadData.telefone) {
            onSubmit(leadData);
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    };

    return (
        <Dialog
            open={modalOpen}
            onClose={handleModalClose}
            PaperProps={{
                sx: {
                    backgroundColor: '#F3F0EE',
                    width: '450px',
                    maxWidth: '80vw',
                },
            }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Cadastre-se para Download
                </Typography>
                <Typography variant="body2" sx={{ marginTop: 1, color: 'text.secondary' }}>
                    Por favor, preencha as informações abaixo para receber o download.
                </Typography>
            </DialogTitle>
            <DialogContent>
                <FormLabel required>
                    Nome
                </FormLabel>
                <OutlinedInput
                    type="text"
                    autoFocus
                    name="nome"
                    fullWidth
                    value={leadData.nome}
                    onChange={handleChange}
                />
                <TelefoneInput
                    name="telefone"
                    value={leadData.telefone}
                    onChange={handleChange}
                    onBlur={() => { }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Enviar</Button>
            </DialogActions>
        </Dialog>
    );
}
