import React from 'react';
import { Grid, Stepper, Step, StepLabel } from '@mui/material';
import { StepperProps } from './StepperTypes';

const StepperMobile: React.FC<StepperProps> = ({ activeStep, steps }) => {
    return (
        <Grid
            item
            xs={12}
            sx={{
                paddingBottom: 1,
                paddingTop: 2,
                width: '100%',
                position: 'sticky',
                top: '0',
                zIndex: 1000,
                backgroundColor: '#F3F0EE',
                paddingLeft: { xs: 1, sm: 1 },
                paddingRight: { xs: 1, sm: 1 },
            }}
        >
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel
                            sx={{
                                '& .MuiStepLabel-label': {
                                    fontSize: '12px'
                                },
                            }}
                        >{step.label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Grid>
    );
}

export default StepperMobile;