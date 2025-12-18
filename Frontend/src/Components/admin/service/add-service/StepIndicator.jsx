import React from 'react';
import { useService } from './ServiceContext';
import { 
  Check, 
  Info, 
  DollarSign, 
  Database, 
  ClipboardCheck, 
  Eye 
} from 'lucide-react';

const steps = [
  { 
    id: 1, 
    label: 'Service Info', 
    description: 'Defines the core identity and purpose of the service.',
    icon: Info 
  },
  { 
    id: 2, 
    label: 'Setup Plans & Pricing', 
    description: 'Define pricing tiers and packages',
    icon: DollarSign 
  },
  { 
    id: 3, 
    label: 'Dataset Setup', 
    description: 'Setup the operational flow and compliance steps.',
    icon: Database 
  },
  { 
    id: 4, 
    label: 'Configure Checklist', 
    description: 'Setup the operational flow and compliance steps.',
    icon: ClipboardCheck 
  },
  { 
    id: 5, 
    label: 'Review & Publish', 
    description: 'Final validation before activating the service.',
    icon: Eye 
  },
];

export default function StepIndicator() {
  const { currentStep, setCurrentStep } = useService();

  const isCompleted = (stepId) => {
    return currentStep > stepId;
  };

  const isActive = (stepId) => {
    return currentStep === stepId;
  };

  const canNavigateTo = (stepId) => {
    return currentStep > stepId;
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col relative">
        {/* Vertical progress line */}
        <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-gray-200 z-0"></div>
        <div 
          className="absolute top-0 left-5 w-0.5 bg-[#6869AC] z-10 transition-all duration-300"
          style={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div key={step.id} className="relative z-20 flex items-start mb-8 last:mb-0">
              {/* Step circle */}
              <div className="flex-shrink-0 mr-4">
                <button
                  onClick={() => canNavigateTo(step.id) && setCurrentStep(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive(step.id)
                      ? 'bg-[#6869AC] border-[#6869AC] text-white'
                      : isCompleted(step.id)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  } ${canNavigateTo(step.id) ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                >
                  {isCompleted(step.id) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Step content */}
              <div className="flex-1">
                <div className="flex flex-col">
                  <span className={`text-base font-semibold ${
                    isActive(step.id) ? 'text-[#6869AC]' : 
                    isCompleted(step.id) ? 'text-green-600' : 'text-gray-700'
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}