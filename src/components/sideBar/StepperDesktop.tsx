import React from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography,
} from '@mui/material';
import StepConnector from '@mui/material/StepConnector';
import DocumentosParaAssinar from '../../pages/sections/DocumentosParaAssinar';


interface StepperDesktopProps {
    activeStep: number;
    pdfUrls: { [key: string]: string | null };
}

const StepperDesktop: React.FC<StepperDesktopProps> = ({ activeStep, pdfUrls }) => {
    const documentosGerados = pdfUrls ? Object.values(pdfUrls).filter((url) => url !== null).length : 0;
    const stepLabelStyles = {
        '& .MuiStepLabel-label': {
            fontSize: '1.2rem',
        },
        '& .MuiStepIcon-root': {
            fontSize: '2rem',

            '&.Mui-completed': {
                color: '#549F5E',
            },
            '&.Mui-active': {
                color: '#549F5E',
            }
        }
    };

    const stepContentStyles = {
        '& .MuiTypography-root': { fontSize: '0.9rem' },
    };

    return (
        <Stepper
            activeStep={activeStep}
            orientation="vertical"
            connector={
                <StepConnector
                    sx={{
                        '& .MuiStepConnector-line': {
                            color: '#549F5E',
                            height: '100%'
                        },
                    }}
                />
            }
        >
            <Step>
                <StepLabel sx={stepLabelStyles}>
                    Dados pessoais
                </StepLabel>
                <StepContent sx={stepContentStyles}>
                    <Typography>Primeira etapa necessária para geração de diversos documentos</Typography>
                </StepContent>
            </Step>

            <Step>
                <StepLabel sx={stepLabelStyles}>
                    Endereço
                </StepLabel>
                <StepContent sx={stepContentStyles}>
                    <Typography>Dados referente ao seu endereço</Typography>
                </StepContent>
            </Step>

            <Step>
                <StepLabel sx={stepLabelStyles}>
                    Documentos já concluídos ({documentosGerados})
                </StepLabel>
                <StepContent sx={stepContentStyles}>
                    <DocumentosParaAssinar urls={pdfUrls} fullView={false} />
                </StepContent>
            </Step>
        </Stepper>
    );
};

export default StepperDesktop;