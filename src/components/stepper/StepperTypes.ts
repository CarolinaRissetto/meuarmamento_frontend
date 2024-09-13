
export interface StepContentProps {
    label: string;
    description: string;
    content?: React.ReactNode;
  }
  
  export interface StepperProps {
    activeStep: number;
    steps: StepContentProps[];
  }
  