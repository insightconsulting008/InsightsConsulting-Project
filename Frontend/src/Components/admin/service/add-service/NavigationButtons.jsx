import React from 'react';
import { useService } from './ServiceContext';

export default function NavigationButtons() {
  const { currentStep, setCurrentStep } = useService();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className={`px-6 py-2 rounded-lg font-medium ${
          currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentStep === 5}
        className={`px-6 py-2 rounded-lg font-medium ${
          currentStep === 5
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-red text-white hover:opacity-90'
        }`}
      >
        Next
      </button>
    </div>
  );
}