import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from "@mui/material";
import StepConnector from "@mui/material/StepConnector";

interface StepContentProps {
  label: string;
  description: string;
  content?: React.ReactNode;
}

interface StepperDesktopProps {
  activeStep: number;
  steps: StepContentProps[];
}

const StepperDesktop: React.FC<StepperDesktopProps> = ({
  activeStep,
  steps,
}) => {
  const stepLabelStyles = {
    "& .MuiStepLabel-label": {
      fontSize: "1.45rem",
      color: "#211f50",
    },
    "& .MuiStepLabel-label.Mui-completed": {
      color: "#549F5E",
    },
    "& .MuiStepIcon-root": {
      fontSize: "2.5rem",
      "&.Mui-completed": {
        color: "#549F5E",
      },
      "&.Mui-active": {
        color: "#1469bd",
      },
    },
  };

  const connectorStyles = {
    "& .MuiStepConnector-line": {
      borderLeftWidth: "2px",
      borderLeftStyle: "solid",
      borderLeftColor: "#bdbdbd",
      marginLeft: "7px",
      height: "20px",
    },
  };

  return (
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      connector={<StepConnector sx={connectorStyles} />}
    >
      {steps.map((step, index) => {
        const isLastStep = index === steps.length - 1;

        const stepContentStyles = {
          marginLeft: "19px",
          paddingLeft: "21px",
          paddingRight: "8px",
          borderLeft: isLastStep ? "none" : "2px solid #bdbdbd",
          paddingTop: "20px",
        };

        return (
          <Step key={index}>
            <StepLabel sx={stepLabelStyles}>{step.label}</StepLabel>
            <StepContent sx={stepContentStyles}>
              <Typography sx={{ marginBottom: "8px" }}>
                {step.description}
              </Typography>
              {step.content && <div>{step.content}</div>}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default StepperDesktop;
