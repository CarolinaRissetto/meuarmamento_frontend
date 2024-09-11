import React from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography,
} from '@mui/material';
import StepConnector from '@mui/material/StepConnector';


interface StepContentProps {
    label: string;
    description: string;
    content?: React.ReactNode;
}

interface StepperDesktopProps {
    activeStep: number;
    steps: StepContentProps[];
}

const StepperDesktop: React.FC<StepperDesktopProps> = ({ activeStep, steps }) => {

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
            {steps.map((step, index) => (
                <Step key={index}>
                    <StepLabel sx={stepLabelStyles}>
                        {step.label}
                    </StepLabel>
                    <StepContent sx={stepContentStyles}>
                        <Typography>{step.description}</Typography>
                        {step.content && <div>{step.content}</div>}
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    );
};

export default StepperDesktop;