"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

// Type definitions for stepper configuration
interface StepperContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  steps: StepConfig[];
  setSteps: (steps: StepConfig[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isIndicatorButtonsAccessible: boolean;
  completedSteps: Set<number>;
  setStepCompleted: (step: number, completed: boolean) => void;
}

interface StepConfig {
  completed: boolean;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

// Hook to access stepper context
export const useStepper = (): StepperContextType => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within StepperProvider");
  }
  return context;
};

// Provider component that manages stepper state
interface StepperProviderProps {
  children: ReactNode;
  isIndicatorButtonsAccessible?: boolean;
  defaultStep?: number;
}

export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
  isIndicatorButtonsAccessible = true,
  defaultStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(defaultStep);
  const [steps, setSteps] = useState<StepConfig[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const nextStep = (): void => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = (): void => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number): void => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const setStepCompleted = (step: number, completed: boolean): void => {
    const newCompleted = new Set(completedSteps);
    if (completed) {
      newCompleted.add(step);
    } else {
      newCompleted.delete(step);
    }
    setCompletedSteps(newCompleted);
  };

  const value: StepperContextType = {
    currentStep,
    setCurrentStep,
    steps,
    setSteps,
    nextStep,
    prevStep,
    goToStep,
    isIndicatorButtonsAccessible,
    completedSteps,
    setStepCompleted,
  };

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  );
};

// Step container component
interface StepProps {
  index: number;
  children: ReactNode;
}

export const Step: React.FC<StepProps> = ({ index, children }) => {
  const { currentStep, steps, setSteps } = useStepper();

  // Initialize steps array
  React.useEffect(() => {
    if (steps.length === 0 || index >= steps.length) {
      const newSteps = Array.from({ length: index + 1 }, () => ({
        completed: false,
      }));
      setSteps(newSteps);
    }
  }, [index, steps, setSteps]);

  if (currentStep !== index) {
    return null;
  }

  return <div className="step-content">{children}</div>;
};

// Step title component
interface StepTitleProps {
  children: ReactNode;
  stepNumber: number;
  className?: string;
}

export const StepTitle: React.FC<StepTitleProps> = ({
  children,
  stepNumber,
  className,
}) => {
  return (
    <h2 className={cn("step-title mb-6", className)}>
      STEP {stepNumber + 1}: {children}
    </h2>
  );
};

// Step content wrapper
interface StepContentProps {
  children: ReactNode;
}

export const StepContent: React.FC<StepContentProps> = ({ children }) => {
  return <div className="step-content-body">{children}</div>;
};

// Stepper indicators component - displays progress dots/buttons
interface StepperIndicatorsProps {
  labels: string[];
  className?: string;
}

export const StepperIndicators: React.FC<StepperIndicatorsProps> = ({
  labels,
  className,
}) => {
  const {
    currentStep,
    goToStep,
    isIndicatorButtonsAccessible,
    completedSteps,
  } = useStepper();

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 mb-8 relative",
        className,
      )}
    >
      {labels.map((label, index) => (
        <React.Fragment key={index}>
          {/* Indicator button/circle */}
          <button
            onClick={() => isIndicatorButtonsAccessible && goToStep(index)}
            disabled={!isIndicatorButtonsAccessible}
            className={cn(
              "w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center z-10 relative",
              currentStep === index
                ? "bg-blue-600 text-white shadow-lg"
                : completedSteps.has(index)
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-600",
            )}
            title={label}
          >
            {completedSteps.has(index) ? "✓" : index + 1}
          </button>

          {/* Connecting line between indicators */}
          {index < labels.length - 1 && (
            <div
              className={cn(
                "flex-1 h-1 transition-all duration-300",
                completedSteps.has(index) ? "bg-green-600" : "bg-gray-300",
              )}
              style={{ minWidth: "40px" }}
            />
          )}
        </React.Fragment>
      ))}

      {/* Labels below indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-600 px-2">
        {labels.map((label, index) => (
          <span
            key={index}
            className="w-12 text-center text-xs truncate"
            title={label}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
